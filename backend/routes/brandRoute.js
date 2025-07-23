import express from "express";
import {
  brandCreateValidation,
  brandUpdateValidation,
  userIdValidation,
  createBrand,
  updateBrand,
  getBrandById,
  getBrandByUserId,
  getAllBrands,
  deleteBrand,
} from "../controllers/brandController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new brand
router.post("/", brandCreateValidation, verifyToken, createBrand);

// Get a brand by ID
router.get("/:id", verifyToken, getBrandById);

// Update a brand by ID
router.put("/:id", brandUpdateValidation, verifyToken, updateBrand);

// Delete a brand by ID (soft delete)
router.delete("/:id", verifyToken, deleteBrand);

// Get all brands
router.get("/", verifyToken, getAllBrands);

// Get brand by user ID
router.get("/by-user/:userId", userIdValidation, verifyToken, getBrandByUserId);

export default router;
