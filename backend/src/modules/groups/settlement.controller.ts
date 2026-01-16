import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../auth/auth.middleware";
import { Group } from "./group.model";
import { Transaction } from "../transactions/transaction.model";

export const settleUp = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId, receiverId, amount } = req.body;

    if (!groupId || !receiverId || !amount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const payerId = req.user!.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Ensure both users are group members
    const isPayerMember = group.members.some(
      id => id.toString() === payerId
    );
    const isReceiverMember = group.members.some(
      id => id.toString() === receiverId
    );

    if (!isPayerMember || !isReceiverMember) {
      return res.status(403).json({ message: "Users not in group" });
    }

    const payerBalance = group.balances.get(payerId) || 0;
    const receiverBalance = group.balances.get(receiverId) || 0;

    if (payerBalance >= 0) {
      return res
        .status(400)
        .json({ message: "Payer does not owe money" });
    }

    if (receiverBalance <= 0) {
      return res
        .status(400)
        .json({ message: "Receiver is not owed money" });
    }

    // Prevent over-settlement
    const maxSettleAmount = Math.min(
      Math.abs(payerBalance),
      receiverBalance
    );

    if (amount > maxSettleAmount) {
      return res.status(400).json({
        message: `Maximum settlement allowed is ${maxSettleAmount}`
      });
    }

    // Update balances
    group.balances.set(payerId, payerBalance + amount);
    group.balances.set(receiverId, receiverBalance - amount);

    await group.save();

    // Record transaction (logical settlement record)
    await Transaction.create({
      payer: new mongoose.Types.ObjectId(payerId),
      receiver: new mongoose.Types.ObjectId(receiverId),
      amount,
      method: "CARD",
      status: "completed"
    });

    res.json({
      message: "Settlement completed",
      balances: Object.fromEntries(group.balances)
    });
  } catch (error) {
    res.status(500).json({ message: "Settlement failed" });
  }
};
