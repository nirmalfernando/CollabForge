import Review from "../models/Review.js";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

// Validation rules for creating a review
const reviewValidation = [
  body("campaignId")
    .notEmpty()
    .withMessage("Campaign ID is required")
    .isUUID()
    .withMessage("Campaign ID must be a valid UUID"),
  body("creatorId")
    .notEmpty()
    .withMessage("Creator ID is required")
    .isUUID()
    .withMessage("Creator ID must be a valid UUID"),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Comment must be up to 1000 characters long"),
];

// Create a new review
export const createReview = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during review creation", {
      errors: errors.array(),
      reviewData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { campaignId, creatorId, rating, comment } = req.body;

  try {
    // Check if review already exists for this campaign and creator
    const existingReview = await Review.findOne({
      where: { campaignId, creatorId },
    });

    if (existingReview) {
      logger.warn("Review creation failed: Review already exists", {
        campaignId,
        creatorId,
      });
      return res.status(400).json({
        message: "Review already exists for this campaign and creator",
      });
    }

    // Create a new review
    const newReview = await Review.create({
      reviewId: uuidv4(),
      campaignId,
      creatorId,
      rating,
      comment: comment || null,
    });

    logger.info("Review created successfully", {
      reviewId: newReview.reviewId,
      campaignId,
      creatorId,
    });

    return res.status(201).json({
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error) {
    logger.error("Error during review creation", {
      error: error.message,
      reviewData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during review creation",
      error: error.message,
    });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      logger.warn("Get review failed: Review not found", { reviewId });
      return res.status(404).json({ message: "Review not found" });
    }

    logger.info("Review retrieved successfully", { reviewId });
    return res.status(200).json(review);
  } catch (error) {
    logger.error("Error during getting review", {
      error: error.message,
      reviewId,
    });
    return res.status(500).json({
      message: "Internal server error during getting review",
      error: error.message,
    });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [["createdAt", "DESC"]],
    });

    if (reviews.length === 0) {
      logger.info("No reviews found");
      return res.status(404).json({ message: "No reviews found" });
    }

    logger.info("All reviews retrieved successfully");
    return res.status(200).json(reviews);
  } catch (error) {
    logger.error("Error during getting all reviews", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all reviews",
      error: error.message,
    });
  }
};

// Get reviews by campaign ID
export const getReviewsByCampaign = async (req, res) => {
  const campaignId = req.params.campaignId;

  try {
    const reviews = await Review.findAll({
      where: { campaignId },
      order: [["createdAt", "DESC"]],
    });

    if (reviews.length === 0) {
      logger.info("No reviews found for campaign", { campaignId });
      return res
        .status(404)
        .json({ message: "No reviews found for this campaign" });
    }

    logger.info("Reviews retrieved successfully for campaign", { campaignId });
    return res.status(200).json(reviews);
  } catch (error) {
    logger.error("Error during getting reviews by campaign", {
      error: error.message,
      campaignId,
    });
    return res.status(500).json({
      message: "Internal server error during getting reviews by campaign",
      error: error.message,
    });
  }
};

// Get reviews by creator ID
export const getReviewsByCreator = async (req, res) => {
  const creatorId = req.params.creatorId;

  try {
    const reviews = await Review.findAll({
      where: { creatorId },
      order: [["createdAt", "DESC"]],
    });

    if (reviews.length === 0) {
      logger.info("No reviews found for creator", { creatorId });
      return res
        .status(404)
        .json({ message: "No reviews found for this creator" });
    }

    logger.info("Reviews retrieved successfully for creator", { creatorId });
    return res.status(200).json(reviews);
  } catch (error) {
    logger.error("Error during getting reviews by creator", {
      error: error.message,
      creatorId,
    });
    return res.status(500).json({
      message: "Internal server error during getting reviews by creator",
      error: error.message,
    });
  }
};

// Update review
export const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      logger.warn("Review update failed: Review not found", { reviewId });
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the fields if they are provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      if (comment.length > 1000) {
        return res
          .status(400)
          .json({ message: "Comment must be up to 1000 characters long" });
      }
      review.comment = comment;
    }

    await review.save();

    logger.info("Review updated successfully", { reviewId });
    return res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    logger.error("Error during review update", {
      error: error.message,
      reviewId,
      reviewData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during review update",
      error: error.message,
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      logger.warn("Review deletion failed: Review not found", { reviewId });
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();

    logger.info("Review deleted successfully", { reviewId });
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    logger.error("Error during review deletion", {
      error: error.message,
      reviewId,
    });
    return res.status(500).json({
      message: "Internal server error during review deletion",
      error: error.message,
    });
  }
};

// Export validation rules for use in routes
export { reviewValidation };

export default {
  createReview,
  getReviewById,
  getAllReviews,
  getReviewsByCampaign,
  getReviewsByCreator,
  updateReview,
  deleteReview,
};
