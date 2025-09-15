import express from "express";
import {
  getTopCreatorsByCategory,
  getAllTopCreators,
  triggerTopCreatorsCalculation,
  getTopCreatorsJobStatus,
  getTopCreatorsByCategoryValidation,
  getAllTopCreatorsValidation,
} from "../controllers/recommendationController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Get top creators for a specific category
router.get(
  "/top-creators/category/:categoryId",
  verifyToken,
  getTopCreatorsByCategoryValidation,
  getTopCreatorsByCategory
);

// Get all top creators across categories
router.get(
  "/top-creators",
  verifyToken,
  getAllTopCreatorsValidation,
  getAllTopCreators
);

// Manually trigger top creators calculation (admin only)
router.post(
  "/top-creators/calculate",
  verifyToken,
  triggerTopCreatorsCalculation
);

// Get job status and last update info
router.get(
  "/top-creators/status",
  verifyToken,
  getTopCreatorsJobStatus
);

export default router;