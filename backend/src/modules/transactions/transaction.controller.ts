import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../auth/auth.middleware";
import { Transaction } from "./transaction.model";
import { Group } from "../groups/group.model";

/* ================================
   PAYER → MARK AS PAID (PENDING)
================================ */
export const createSettlement = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { groupId, receiverId, amount, method } = req.body;

    if (!groupId || !receiverId || !amount || !method) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const tx = await Transaction.create({
      group: new mongoose.Types.ObjectId(groupId),
      payer: new mongoose.Types.ObjectId(req.user!.userId),
      receiver: new mongoose.Types.ObjectId(receiverId),
      amount,
      method,
      status: "pending"
    });

    res.status(201).json(tx);
  } catch {
    res.status(500).json({ message: "Failed to create settlement" });
  }
};

/* ================================
   RECEIVER → CONFIRM
================================ */
export const confirmSettlement = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { transactionId } = req.body;

    const tx = await Transaction.findById(transactionId);
    if (!tx) return res.status(404).json({ message: "Not found" });

    if (tx.receiver.toString() !== req.user!.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (tx.status !== "pending") {
      return res.status(400).json({ message: "Invalid state" });
    }

    const group = await Group.findById(tx.group);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const payerId = tx.payer.toString();
    const receiverId = tx.receiver.toString();

    group.balances.set(
      payerId,
      (group.balances.get(payerId) || 0) + tx.amount
    );

    group.balances.set(
      receiverId,
      (group.balances.get(receiverId) || 0) - tx.amount
    );

    tx.status = "completed";

    await group.save();
    await tx.save();

    res.json({ message: "Settlement confirmed" });
  } catch {
    res.status(500).json({ message: "Confirmation failed" });
  }
};

/* ================================
   RECEIVER → REJECT
================================ */
export const rejectSettlement = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { transactionId } = req.body;

    const tx = await Transaction.findById(transactionId);
    if (!tx) return res.status(404).json({ message: "Not found" });

    if (tx.receiver.toString() !== req.user!.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    tx.status = "rejected";
    await tx.save();

    res.json({ message: "Settlement rejected" });
  } catch {
    res.status(500).json({ message: "Reject failed" });
  }
};

/* ================================
   RECEIVER INBOX (PENDING)
================================ */
export const getPendingSettlements = async (
  req: AuthRequest,
  res: Response
) => {
  const txs = await Transaction.find({
    receiver: req.user!.userId,
    status: "pending"
  })
    .populate("payer", "name")
    .populate("group", "name")
    .sort({ createdAt: -1 });

  res.json(txs);
};

/* ================================
   GROUP HISTORY
================================ */
export const getGroupTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  const txs = await Transaction.find({
    group: req.params.groupId,
    status: "completed"
  })
    .populate("payer receiver", "name")
    .sort({ createdAt: -1 });

  res.json(txs);
};
