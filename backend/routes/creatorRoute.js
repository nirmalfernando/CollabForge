import express from "express";
import {
  creatorCreateValidation,
  creatorUpdateValidation,
  creatorQueryValidation,
  createCreator,
  updateCreator,
  getCreatorById,
  getCreatorByUserId,
  getAllCreators,
  getCreatorsByCategory,
  getCreatorsByType,
  deleteCreator,
} from "../controllers/creatorController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new creator
router.post("/", verifyToken, creatorCreateValidation, createCreator);

// Get a creator by ID
router.get("/:id", verifyToken, getCreatorById);

// Update a creator by ID
router.put("/:id", verifyToken, creatorUpdateValidation, updateCreator);

// Delete a creator by ID (soft delete)
router.delete("/:id", verifyToken, deleteCreator);

// Get all creators
router.get("/", verifyToken, getAllCreators);

// Get creators by category ID
router.get(
  "/by-category",
  verifyToken,
  creatorQueryValidation,
  getCreatorsByCategory
);

// Get creators by type
router.get("/by-type", verifyToken, creatorQueryValidation, getCreatorsByType);

// Get creator by user ID
router.get(
  "/by-user/:userId",
  verifyToken,
  creatorQueryValidation,
  getCreatorByUserId
);

export default router;
