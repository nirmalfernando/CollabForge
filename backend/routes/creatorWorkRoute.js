import express from "express";
import {
  createCreatorWork,
  updateCreatorWork,
  getCreatorWorkById,
  getWorksByCreatorId,
  getAllCreatorWorks,
  toggleWorkVisibility,
  deleteCreatorWork,
  creatorWorkValidation,
} from "../controllers/creatorWorkController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new creator work
router.post("/", verifyToken, creatorWorkValidation, createCreatorWork);

// Get all creator works with optional filters
router.get("/", getAllCreatorWorks);

// Get works by specific creator ID
router.get("/creator/:creatorId", getWorksByCreatorId);

// Get specific work by ID
router.get("/:id", getCreatorWorkById);

// Update creator work
router.put("/:id", verifyToken, updateCreatorWork);

// Toggle work visibility
router.patch("/:id/visibility", verifyToken, toggleWorkVisibility);

// Delete creator work (soft delete)
router.delete("/:id", verifyToken, deleteCreatorWork);

export default router;
