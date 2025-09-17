import BrandReview from "../models/BrandReview.js";
import Brand from "../models/Brand.js";
import Creator from "../models/Creator.js";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

// Validation rules for creating a brand review
const brandReviewValidation = [
  body("creatorId")
    .notEmpty()
    .withMessage("Creator ID is required")
    .isUUID()
    .withMessage("Creator ID must be a valid UUID"),
  body("brandId")
    .notEmpty()
    .withMessage("Brand ID is required")
    .isUUID()
    .withMessage("Brand ID must be a valid UUID"),
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

// Helper function to define common includes for brand reviews
const getBrandReviewIncludes = () => [
  {
    model: Brand,
    as: "brand",
    attributes: ["brandId", "companyName"], // Get brand's company name
  },
  {
    model: Creator,
    as: "creator",
    attributes: ["creatorId", "firstName", "lastName"], // Get creator's first and last name
  },
];

// Create a new brand review
export const createBrandReview = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during brand review creation", {
      errors: errors.array(),
      reviewData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { creatorId, brandId, rating, comment } = req.body;

  try {
    // Check if brand review already exists for this creator and brand
    const existingReview = await BrandReview.findOne({
      where: { creatorId, brandId },
    });

    if (existingReview) {
      logger.warn("Brand review creation failed: Review already exists", {
        creatorId,
        brandId,
      });
      return res.status(400).json({
        message: "Brand review already exists for this creator and brand",
      });
    }

    // Create a new brand review
    const newBrandReview = await BrandReview.create({
      reviewId: uuidv4(),
      creatorId,
      brandId,
      rating,
      comment: comment || null,
    });

    // Fetch the created review with includes
    const brandReviewWithDetails = await BrandReview.findByPk(
      newBrandReview.reviewId,
      {
        include: getBrandReviewIncludes(),
      }
    );

    logger.info("Brand review created successfully", {
      reviewId: newBrandReview.reviewId,
      creatorId,
      brandId,
    });

    return res.status(201).json({
      message: "Brand review created successfully",
      brandReview: brandReviewWithDetails,
    });
  } catch (error) {
    logger.error("Error during brand review creation", {
      error: error.message,
      reviewData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during brand review creation",
      error: error.message,
    });
  }
};

// Get brand review by ID
export const getBrandReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const brandReview = await BrandReview.findByPk(reviewId, {
      include: getBrandReviewIncludes(),
    });

    if (!brandReview) {
      logger.warn("Get brand review failed: Brand review not found", {
        reviewId,
      });
      return res.status(404).json({ message: "Brand review not found" });
    }

    logger.info("Brand review retrieved successfully", { reviewId });
    return res.status(200).json(brandReview);
  } catch (error) {
    logger.error("Error during getting brand review", {
      error: error.message,
      reviewId,
    });
    return res.status(500).json({
      message: "Internal server error during getting brand review",
      error: error.message,
    });
  }
};

// Get all brand reviews
export const getAllBrandReviews = async (req, res) => {
  try {
    const brandReviews = await BrandReview.findAll({
      include: getBrandReviewIncludes(),
      order: [["createdAt", "DESC"]],
    });

    if (brandReviews.length === 0) {
      logger.info("No brand reviews found");
      return res.status(404).json({ message: "No brand reviews found" });
    }

    logger.info("All brand reviews retrieved successfully");
    return res.status(200).json(brandReviews);
  } catch (error) {
    logger.error("Error during getting all brand reviews", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all brand reviews",
      error: error.message,
    });
  }
};

// Get brand reviews by creator ID
export const getBrandReviewsByCreator = async (req, res) => {
  const creatorId = req.params.creatorId;

  try {
    const brandReviews = await BrandReview.findAll({
      where: { creatorId },
      include: getBrandReviewIncludes(),
      order: [["createdAt", "DESC"]],
    });

    if (brandReviews.length === 0) {
      logger.info("No brand reviews found for creator", { creatorId });
      return res
        .status(404)
        .json({ message: "No brand reviews found for this creator" });
    }

    logger.info("Brand reviews retrieved successfully for creator", {
      creatorId,
    });
    return res.status(200).json(brandReviews);
  } catch (error) {
    logger.error("Error during getting brand reviews by creator", {
      error: error.message,
      creatorId,
    });
    return res.status(500).json({
      message: "Internal server error during getting brand reviews by creator",
      error: error.message,
    });
  }
};

// Get brand reviews by brand ID
export const getBrandReviewsByBrand = async (req, res) => {
  const brandId = req.params.brandId;

  try {
    const brandReviews = await BrandReview.findAll({
      where: { brandId },
      include: getBrandReviewIncludes(),
      order: [["createdAt", "DESC"]],
    });

    if (brandReviews.length === 0) {
      logger.info("No brand reviews found for brand", { brandId });
      return res
        .status(404)
        .json({ message: "No brand reviews found for this brand" });
    }

    logger.info("Brand reviews retrieved successfully for brand", { brandId });
    return res.status(200).json(brandReviews);
  } catch (error) {
    logger.error("Error during getting brand reviews by brand", {
      error: error.message,
      brandId,
    });
    return res.status(500).json({
      message: "Internal server error during getting brand reviews by brand",
      error: error.message,
    });
  }
};

// Get brand reviews by the review visibility
export const getBrandReviewsByVisibility = async (req, res) => {
  const isShown = req.query.isShown === "true";

  try {
    const brandReviews = await BrandReview.findAll({
      where: { isShown },
      include: getBrandReviewIncludes(),
      order: [["createdAt", "DESC"]],
    });

    if (brandReviews.length === 0) {
      logger.info("No brand reviews found for the specified visibility", {
        isShown,
      });
      return res.status(404).json({
        message: "No brand reviews found for the specified visibility",
      });
    }

    logger.info(
      "Brand reviews retrieved successfully for the specified visibility",
      { isShown }
    );
    return res.status(200).json(brandReviews);
  } catch (error) {
    logger.error("Error during getting brand reviews by visibility", {
      error: error.message,
      isShown,
    });
    return res.status(500).json({
      message:
        "Internal server error during getting brand reviews by visibility",
      error: error.message,
    });
  }
};

// Update brand review
export const updateBrandReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  try {
    const brandReview = await BrandReview.findByPk(reviewId);

    if (!brandReview) {
      logger.warn("Brand review update failed: Brand review not found", {
        reviewId,
      });
      return res.status(404).json({ message: "Brand review not found" });
    }

    // Update the fields if they are provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }
      brandReview.rating = rating;
    }

    if (comment !== undefined) {
      if (comment.length > 1000) {
        return res
          .status(400)
          .json({ message: "Comment must be up to 1000 characters long" });
      }
      brandReview.comment = comment;
    }

    await brandReview.save();

    // Fetch updated review with includes
    const updatedBrandReview = await BrandReview.findByPk(reviewId, {
      include: getBrandReviewIncludes(),
    });

    logger.info("Brand review updated successfully", { reviewId });
    return res.status(200).json({
      message: "Brand review updated successfully",
      brandReview: updatedBrandReview,
    });
  } catch (error) {
    logger.error("Error during brand review update", {
      error: error.message,
      reviewId,
      reviewData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during brand review update",
      error: error.message,
    });
  }
};

// Update the visibility of the review
export const updateBrandReviewVisibility = async (req, res) => {
  const reviewId = req.params.id;
  const { isShown } = req.body;

  try {
    const brandReview = await BrandReview.findByPk(reviewId);

    if (!brandReview) {
      logger.warn(
        "Brand review visibility update failed: Brand review not found",
        {
          reviewId,
        }
      );
      return res.status(404).json({ message: "Brand review not found" });
    }

    // Update the visibility field if it is provided
    if (isShown !== undefined) {
      brandReview.isShown = isShown;
    } else {
      return res.status(400).json({ message: "isShown field is required" });
    }

    await brandReview.save();

    // Fetch updated review with includes
    const updatedBrandReview = await BrandReview.findByPk(reviewId, {
      include: getBrandReviewIncludes(),
    });

    logger.info("Brand review visibility updated successfully", { reviewId });
    return res.status(200).json({
      message: "Brand review visibility updated successfully",
      brandReview: updatedBrandReview,
    });
  } catch (error) {
    logger.error("Error during brand review visibility update", {
      error: error.message,
      reviewId,
      reviewData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during brand review visibility update",
      error: error.message,
    });
  }
};

// Delete brand review
export const deleteBrandReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const brandReview = await BrandReview.findByPk(reviewId);

    if (!brandReview) {
      logger.warn("Brand review deletion failed: Brand review not found", {
        reviewId,
      });
      return res.status(404).json({ message: "Brand review not found" });
    }

    await brandReview.destroy();

    logger.info("Brand review deleted successfully", { reviewId });
    return res
      .status(200)
      .json({ message: "Brand review deleted successfully" });
  } catch (error) {
    logger.error("Error during brand review deletion", {
      error: error.message,
      reviewId,
    });
    return res.status(500).json({
      message: "Internal server error during brand review deletion",
      error: error.message,
    });
  }
};

// Export validation rules for use in routes
export { brandReviewValidation };

export default {
  createBrandReview,
  getBrandReviewById,
  getAllBrandReviews,
  getBrandReviewsByCreator,
  getBrandReviewsByBrand,
  getBrandReviewsByVisibility,
  updateBrandReview,
  updateBrandReviewVisibility,
  deleteBrandReview,
};
