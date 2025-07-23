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
router.post("/", creatorCreateValidation, verifyToken, createCreator);

// Get a creator by ID
router.get("/:id", verifyToken, getCreatorById);

// Update a creator by ID
router.put("/:id", creatorUpdateValidation, verifyToken, updateCreator);

// Delete a creator by ID (soft delete)
router.delete("/:id", verifyToken, deleteCreator);

// Get all creators
router.get("/", verifyToken, getAllCreators);

// Get creators by category ID
router.get(
  "/by-category",
  creatorQueryValidation,
  verifyToken,
  getCreatorsByCategory
);

// Get creators by type
router.get("/by-type", creatorQueryValidation, verifyToken, getCreatorsByType);

// Get creator by user ID
router.get(
  "/by-user/:userId",
  creatorQueryValidation,
  verifyToken,
  getCreatorByUserId
);

export default router;
