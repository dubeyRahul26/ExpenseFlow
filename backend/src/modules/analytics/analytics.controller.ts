import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../auth/auth.middleware";
import { Expense } from "../expenses/expense.model";
import { Group } from "../groups/group.model";

/* ---------------- PERSONAL ANALYTICS ---------------- */

export const personalAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.userId);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [stats, recent, groups] = await Promise.all([
      Expense.aggregate([
        {
          $match: {
            owner: userId,
            date: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),
      Expense.find({ owner: userId })
        .sort({ date: -1 })
        .limit(5)
        .select("category amount date"),
      Group.find({ members: userId })
    ]);

    // net balance = sum of all group balances
    const netBalance = groups.reduce((sum, g) => {
      return sum + (g.balances.get(userId.toString()) || 0);
    }, 0);

    res.json({
      totalSpent: stats[0]?.totalSpent || 0,
      count: stats[0]?.count || 0,
      netBalance,
      groupsCount: groups.length,
      recent
    });
  } catch {
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

/* ---------------- CATEGORY ANALYTICS ---------------- */

export const categoryAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.userId);

    const categories = await Expense.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(
      categories.map(c => ({
        category: c._id,
        total: c.total
      }))
    );
  } catch {
    res.status(500).json({ message: "Failed to load category analytics" });
  }
};

/* ---------------- MONTHLY ANALYTICS ---------------- */

export const monthlyAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.userId);

    const monthly = await Expense.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json(
      monthly.map(m => ({
        year: m._id.year,
        month: m._id.month,
        total: m.total
      }))
    );
  } catch {
    res.status(500).json({ message: "Failed to load monthly analytics" });
  }
};

export const groupAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const group = await Group.findById(req.params.groupId).populate(
      "members",
      "name email"
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({
      groupId: group.id,
      name: group.name,
      balances: Object.fromEntries(group.balances)
    });
  } catch {
    res.status(500).json({ message: "Failed to load group analytics" });
  }
};
