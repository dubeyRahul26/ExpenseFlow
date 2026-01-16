import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  balances: Map<string, number>;
}

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    balances: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  { timestamps: true }
);

export const Group = mongoose.model<IGroup>("Group", groupSchema);
