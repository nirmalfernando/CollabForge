import express from "express";
import {
  createCreator,
  getCreatorById,
  updateCreator,
  deleteCreator,
  getAllCreators,
  getCreatorsByCategory,
  getCreatorsByType,
  creatorCreateValidation,
} from "../controllers/creatorController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new creator
router.post("/", verifyToken, creatorCreateValidation, createCreator);

// Get creator by ID
router.get("/:id", verifyToken, getCreatorById);

// Update creator by ID
router.put("/:id", verifyToken, creatorCreateValidation, updateCreator);

// Delete creator by ID
router.delete("/:id", verifyToken, deleteCreator);

// Get all creators
router.get("/", verifyToken, getAllCreators);

// Get creators by category
router.get("/category/:categoryId", verifyToken, getCreatorsByCategory);

// Get creators by type
router.get("/type/:type", verifyToken, getCreatorsByType);

export default router;
