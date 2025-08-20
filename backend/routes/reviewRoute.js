import express from "express";
import {
  createReview,
  getReviewById,
  getAllReviews,
  getReviewsByCampaign,
  getReviewsByCreator,
  updateReview,
  deleteReview,
  reviewValidation,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create review route
router.post("/", verifyToken, reviewValidation, createReview);

// Get all reviews route
router.get("/", verifyToken, getAllReviews);

// Get review by ID route
router.get("/:id", verifyToken, getReviewById);

// Get reviews by campaign ID route
router.get("/campaign/:campaignId", verifyToken, getReviewsByCampaign);

// Get reviews by creator ID route
router.get("/creator/:creatorId", verifyToken, getReviewsByCreator);

// Update review route
router.put("/:id", verifyToken, updateReview);

// Delete review route
router.delete("/:id", verifyToken, deleteReview);

export default router;
