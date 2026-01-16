import { Request, Response } from "express";
import mongoose from "mongoose";
import { Message } from "./message.model";
import { Group } from "../groups/group.model";

export const getGroupMessages = async (req: Request, res: Response) => {
  try {
    const groupId = String(req.params.groupId);
    const userId = req.user!.userId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    const isMember = await Group.exists({
      _id: groupId,
      members: userId,
    });

    if (!isMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ group: groupId })
      .populate("sender", "name")
      .sort({ createdAt: 1 }); //

    res.json(messages);
  } catch {
    res.status(500).json({ message: "Failed to load messages" });
  }
};
