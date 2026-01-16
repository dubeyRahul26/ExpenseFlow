import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "individual" | "admin";
  groups: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["individual", "admin"],
      default: "individual"
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
