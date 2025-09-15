import Review from "../models/Review.js";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

// Validation rules for creating a review
const reviewValidation = [
  body("campaignId")
    .notEmpty()
    .withMessage("Campaign ID is required")
    .isUUID(4)
    .withMessage("Campaign ID must be a valid UUID"),
  body("creatorId")
    .notEmpty()
    .withMessage("Creator ID is required")
    .isUUID(4)
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
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
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
        message: "You have already reviewed this campaign",
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
      stack: error.stack,
      reviewData: req.body,
    });

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Review already exists for this campaign and creator",
      });
    }

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

    logger.info("All reviews retrieved successfully", {
      count: reviews.length,
    });

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

    logger.info("Reviews retrieved successfully for campaign", {
      campaignId,
      count: reviews.length,
    });

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

    logger.info("Reviews retrieved successfully for creator", {
      creatorId,
      count: reviews.length,
    });

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

    // Prepare update data
    const updateData = {};
    if (rating !== undefined) {
      if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        return res
          .status(400)
          .json({ message: "Rating must be an integer between 1 and 5" });
      }
      updateData.rating = rating;
    }

    if (comment !== undefined) {
      if (comment && comment.length > 1000) {
        return res
          .status(400)
          .json({ message: "Comment must be up to 1000 characters long" });
      }
      updateData.comment = comment;
    }

    // Update the review
    await review.update(updateData);

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

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    return res.status(500).json({
      message: "Internal server error during review update",
      error: error.message,
    });
  }
};

//Update the visibility of the review
export const updateReviewVisibility = async (req, res) => {
  const reviewId = req.params.id;
  const { isShown } = req.body;
  
  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      logger.warn("Review visibility update failed: Review not found", { reviewId });
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the visibility field if it is provided
    if (isShown !== undefined) {
      review.isShown = isShown;
      await review.save();
    }

    logger.info("Review visibility updated successfully", { reviewId });
    return res.status(200).json({
      message: "Review visibility updated successfully",
      review,
    });
  } catch (error) {
    logger.error("Error during review visibility update", {
      error: error.message,
      reviewId,
      reviewData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during review visibility update",
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
