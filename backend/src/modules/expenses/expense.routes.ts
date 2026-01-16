import { Router } from "express";
import {
  addExpense,
  getMyExpenses,
  updateExpense,
  deleteExpense
} from "./expense.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getMyExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
