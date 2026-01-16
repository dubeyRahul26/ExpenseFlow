import { Router } from "express";
import {
  createSettlement,
  confirmSettlement,
  rejectSettlement,
  getPendingSettlements,
  getGroupTransactions,
} from "./transaction.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createSettlement);
router.post("/confirm", authMiddleware, confirmSettlement);
router.post("/reject", authMiddleware, rejectSettlement);
router.get("/pending", authMiddleware, getPendingSettlements);
router.get("/group/:groupId", authMiddleware, getGroupTransactions);

export default router;
