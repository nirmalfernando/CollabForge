import express from "express";
import {
  createBrandReview,
  getBrandReviewById,
  getAllBrandReviews,
  getBrandReviewsByCreator,
  getBrandReviewsByBrand,
  updateBrandReview,
  deleteBrandReview,
  brandReviewValidation,
} from "../controllers/brandReviewController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create brand review route
router.post("/", verifyToken, brandReviewValidation, createBrandReview);

// Get all brand reviews route
router.get("/", verifyToken, getAllBrandReviews);

// Get brand review by ID route
router.get("/:id", verifyToken, getBrandReviewById);

// Get brand reviews by creator ID route
router.get("/creator/:creatorId", verifyToken, getBrandReviewsByCreator);

// Get brand reviews by brand ID route
router.get("/brand/:brandId", verifyToken, getBrandReviewsByBrand);

// Update brand review route
router.put("/:id", verifyToken, updateBrandReview);

// Delete brand review route
router.delete("/:id", verifyToken, deleteBrandReview);

export default router;
