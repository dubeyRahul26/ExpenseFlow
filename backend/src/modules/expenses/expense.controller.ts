import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import { Expense } from "./expense.model";

// CREATE EXPENSE
export const addExpense = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than 0" });
    }

    if (!category?.trim()) {
      return res
        .status(400)
        .json({ message: "Category is required" });
    }

    const expense = await Expense.create({
      amount,
      category: category.trim(),
      description: description?.trim(),
      date,
      owner: req.user!.userId
    });

    res.status(201).json(expense);
  } catch {
    res.status(500).json({ message: "Failed to add expense" });
  }
};


// GET MY EXPENSES
export const getMyExpenses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const expenses = await Expense.find({
      owner: req.user!.userId,
      group: null
    })
      .sort({ date: -1 })
      .limit(50);

    res.json(expenses);
  } catch {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// UPDATE EXPENSE
export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, owner: req.user!.userId },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to update expense" });
  }
};

// DELETE EXPENSE
export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      owner: req.user!.userId
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense" });
  }
};
