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
router.post("/", verifyToken, brandCreateValidation, createBrand);

// Get a brand by ID
router.get("/:id", verifyToken, getBrandById);

// Update a brand by ID
router.put("/:id", verifyToken, brandUpdateValidation, updateBrand);

// Delete a brand by ID (soft delete)
router.delete("/:id", verifyToken, deleteBrand);

// Get all brands
router.get("/", verifyToken, getAllBrands);

// Get brand by user ID
router.get("/by-user/:userId", verifyToken, userIdValidation, getBrandByUserId);

export default router;
