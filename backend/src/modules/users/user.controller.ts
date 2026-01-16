import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import { User } from "./user.model";

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const searchUsers = async (
  req: any,
  res: Response
) => {
  try {
    const q = req.query?.q as string | undefined;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    })
      .select("_id name email")
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to search users" });
  }
};