import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  amount: number;
  category: string;
  description?: string;
  date: Date;
  owner: mongoose.Types.ObjectId;
  group?: mongoose.Types.ObjectId | null;
}

const expenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null
    }
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>(
  "Expense",
  expenseSchema
);
