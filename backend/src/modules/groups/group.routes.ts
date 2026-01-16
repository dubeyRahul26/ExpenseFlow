import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import {
  createGroup,
  getMyGroups,
  addGroupExpense,
  getGroupBalances
} from "./group.controller";
import { settleUp } from "./settlement.controller";

const router = Router();

router.post("/", authMiddleware, createGroup);
router.get("/", authMiddleware, getMyGroups);

router.post("/settle", authMiddleware, settleUp);
router.post("/:groupId/expenses", authMiddleware, addGroupExpense);
router.get("/:groupId/balances", authMiddleware, getGroupBalances);

export default router;
