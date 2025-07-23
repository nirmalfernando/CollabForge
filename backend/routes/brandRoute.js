import express from "express";
import {
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
  getBrandsByUserId,
} from "../controllers/brandController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new brand
router.post("/", verifyToken, createBrand);

// Get a brand by ID
router.get("/:id", verifyToken, getBrandById);

// Update a brand by ID
router.put("/:id", verifyToken, updateBrand);

// Delete a brand by ID (soft delete)
router.delete("/:id", verifyToken, deleteBrand);

// Get all brands by user ID
router.get("/user/:userId", verifyToken, getBrandsByUserId);

export default router;
