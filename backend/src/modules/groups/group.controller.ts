import { Request, Response } from "express";
import mongoose from "mongoose";
import { Group } from "./group.model";
import { User } from "../users/user.model";

/* ================= MONEY HELPERS ================= */

const round2 = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;

const normalize = (n: number) =>
  Math.abs(n) < 0.01 ? 0 : round2(n);

/* ================================================= */

/* ---------------- CREATE GROUP ---------------- */

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Group name required" });
    }

    let memberUsers: { _id: mongoose.Types.ObjectId }[] = [];

    if (Array.isArray(members) && members.length > 0) {
      memberUsers = await User.find({
        email: { $in: members }
      }).select("_id");
    }

    const creatorId = new mongoose.Types.ObjectId(req.user!.userId);
    const memberIds = memberUsers.map(u => u._id);

    if (!memberIds.some(id => id.equals(creatorId))) {
      memberIds.push(creatorId);
    }

    const balances = new Map<string, number>();
    memberIds.forEach(id => balances.set(id.toString(), 0));

    const group = await Group.create({
      name: name.trim(),
      members: memberIds,
      createdBy: creatorId,
      balances
    });

    res.status(201).json(group);
  } catch {
    res.status(500).json({ message: "Failed to create group" });
  }
};

/* ---------------- GET MY GROUPS ---------------- */

export const getMyGroups = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const groups = await Group.find({
      members: userId, 
    })
      .select("_id name")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};


/* ---------------- ADD GROUP EXPENSE ---------------- */

export const addGroupExpense = async (req: Request, res: Response) => {
  try {
    const { amount, paidBy, splitType, splits } = req.body;
    const { groupId } = req.params;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.some(m => m.toString() === req.user!.userId)) {
      return res.status(403).json({ message: "Not a group member" });
    }

    const payerId = paidBy || req.user!.userId;
    const members = group.members.map(id => id.toString());

    if (!splitType || splitType === "equal") {
      const share = round2(amount / members.length);

      members.forEach(id => {
        const current = group.balances.get(id) || 0;
        group.balances.set(
          id,
          id === payerId ? current + (amount - share) : current - share
        );
      });
    }

    if (splitType === "custom") {
      const total = splits.reduce(
        (sum: number, s: any) => sum + Number(s.percentage),
        0
      );

      if (total !== 100) {
        return res.status(400).json({
          message: "Split must total 100%"
        });
      }

      splits.forEach((s: any) => {
        const share = (amount * s.percentage) / 100;
        const current = group.balances.get(s.userId) || 0;

        group.balances.set(
          s.userId,
          s.userId === payerId
            ? current + (amount - share)
            : current - share
        );
      });
    }

    group.balances.forEach((value, key) => {
      group.balances.set(key, normalize(value));
    });

    await group.save();

    res.json({
      message: "Expense added",
      balances: Object.fromEntries(group.balances)
    });
  } catch {
    res.status(500).json({ message: "Failed to add group expense" });
  }
};

/* ---------------- GET GROUP BALANCES ---------------- */

export const getGroupBalances = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate(
      "members",
      "name email"
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (
      !group.members.some(
        (m: any) => m._id.toString() === req.user!.userId
      )
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const balances = group.members.map((member: any) => ({
      userId: member._id.toString(),
      name: member.name,
      email: member.email,
      amount: normalize(
        group.balances.get(member._id.toString()) || 0
      )
    }));

    res.json({
      groupId: group._id,
      name: group.name,
      balances
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch balances" });
  }
};
