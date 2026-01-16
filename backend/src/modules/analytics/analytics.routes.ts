import { Router } from "express";
import {
  personalAnalytics,
  categoryAnalytics,
  monthlyAnalytics,
  groupAnalytics
} from "./analytics.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/personal", authMiddleware, personalAnalytics);
router.get("/categories", authMiddleware, categoryAnalytics);
router.get("/monthly", authMiddleware, monthlyAnalytics);
router.get("/group/:groupId", authMiddleware, groupAnalytics);

export default router;
