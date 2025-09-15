import express from "express";
import {
  createReview,
  getReviewById,
  getAllReviews,
  getReviewsByCampaign,
  getReviewsByCreator,
  getReviewsByVisibility,
  updateReview,
  updateReviewVisibility,
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

// Get reviews by visibility route
router.get("/visibility", verifyToken, getReviewsByVisibility);

// Update review route
router.put("/:id", verifyToken, updateReview);

// Update review visibility route
router.patch("/:id/visibility", verifyToken, updateReviewVisibility);

// Delete review route
router.delete("/:id", verifyToken, deleteReview);

export default router;
