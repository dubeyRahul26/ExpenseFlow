import express from "express";
import cors from "cors";
import { env } from "./config/env";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import expenseRoutes from "./modules/expenses/expense.routes";
import groupRoutes from "./modules/groups/group.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import chatRoutes from "./modules/chat/chat.routes"

const app = express();

/* ---------- CORS (THIS IS ENOUGH) ---------- */
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ---------- BODY PARSER ---------- */
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/chat", chatRoutes);

/* ---------- HEALTH ---------- */
app.get("/", (_, res) => {
  res.send("API is running");
});

export default app;
