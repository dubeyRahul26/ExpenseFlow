import { Router } from "express";
import { getMe, searchUsers } from "./user.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.get("/search", authMiddleware, searchUsers);


export default router;
