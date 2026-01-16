import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../../config/env";
import { Message } from "./message.model";
import { Group } from "../groups/group.model";

/* ---------- TYPES ---------- */
interface AuthPayload {
  userId: string;
}

/* ---------- SOCKET ---------- */
export const setupChatSocket = (io: Server): void => {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;

      socket.data.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("🟢 Connected:", socket.data.userId);

    socket.on("join-group", async (groupId: string) => {
      if (!mongoose.Types.ObjectId.isValid(groupId)) return;

      const isMember = await Group.exists({
        _id: groupId,
        members: socket.data.userId,
      });

      if (!isMember) return;

      socket.join(`group:${groupId}`);
    });

    socket.on(
      "send-message",
      async ({ groupId, text }: { groupId: string; text: string }) => {
        if (!text?.trim()) return;

        const isMember = await Group.exists({
          _id: groupId,
          members: socket.data.userId,
        });

        if (!isMember) return;

        const message = await Message.create({
          group: groupId,
          sender: socket.data.userId,
          text,
        });

        const populated = await message.populate("sender", "name");

        io.to(`group:${groupId}`).emit("receive-message", populated);
      }
    );

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.data.userId);
    });

    socket.on("leave-group", (groupId: string) => {
      socket.leave(`group:${groupId}`);
    });
  });
};
