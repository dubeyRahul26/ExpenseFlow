import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  group: mongoose.Types.ObjectId;
  payer: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  amount: number;
  method: "UPI" | "CASH" | "BANK";
  status: "pending" | "completed" | "rejected";
}

const transactionSchema = new Schema<ITransaction>(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      enum: ["UPI", "CASH", "BANK"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
