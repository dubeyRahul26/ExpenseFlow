import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { getGroupMessages } from "./chat.controller";

const router = Router();

router.get(
  "/group/:groupId",
  authMiddleware,
  getGroupMessages
);

export default router;
