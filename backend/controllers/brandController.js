import Brand from "../models/Brand.js";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

// Validation rules for brand creation
const brandCreateValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID(4)
    .withMessage("User ID must be a valid UUID")
    .custom(async (value) => {
      const user = await User.findOne({
        where: { userId: value, status: true },
      });
      if (!user) {
        throw new Error("Associated user does not exist or is inactive");
      }
      const existingBrand = await Brand.findOne({ where: { brandId: value } });
      if (existingBrand) {
        throw new Error("A brand profile already exists for this user");
      }
    }),
  body("companyName")
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Company name must be between 1 and 100 characters long"),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio must be up to 500 characters long"),
  body("description")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        JSON.parse(typeof value === "string" ? value : JSON.stringify(value));
        return true;
      } catch (error) {
        throw new Error("Description must be a valid JSON object");
      }
    }),
  body("whatWeLookFor")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        JSON.parse(typeof value === "string" ? value : JSON.stringify(value));
        return true;
      } catch (error) {
        throw new Error("What we look for must be a valid JSON object");
      }
    }),
  body("profilePicUrl")
    .optional()
    .isURL()
    .withMessage("Profile picture URL must be a valid URL"),
  body("backgroundImageUrl")
    .optional()
    .isURL()
    .withMessage("Background image URL must be a valid URL"),
];

// Validation rules for updating popular campaigns
const updatePopularCampaignsValidation = [
  body("popularCampaigns")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("Popular campaigns must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each campaign must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error(
          "Popular campaigns must be a valid JSON array of objects"
        );
      }
    }),
];

// Create a new brand
export const createBrand = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during brand creation", {
      errors: errors.array(),
      brandData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    userId,
    companyName,
    bio,
    description,
    whatWeLookFor,
    profilePicUrl,
    backgroundImageUrl,
  } = req.body;

  try {
    // Parse JSON fields if they are strings
    const parsedDescription = description
      ? typeof description === "string"
        ? JSON.parse(description)
        : description
      : null;
    const parsedWhatWeLookFor = whatWeLookFor
      ? typeof whatWeLookFor === "string"
        ? JSON.parse(whatWeLookFor)
        : whatWeLookFor
      : null;

    // Create a new brand
    const newBrand = await Brand.create({
      brandId: userId, // Use userId as brandId due to one-to-one relationship
      companyName,
      bio,
      description: parsedDescription,
      whatWeLookFor: parsedWhatWeLookFor,
      profilePicUrl,
      backgroundImageUrl,
      popularCampaigns: [], // Default to empty array as per model
      status: true, // Default status to true
    });

    logger.info("Brand created successfully", {
      brandId: newBrand.brandId,
      companyName: newBrand.companyName,
    });

    return res
      .status(201)
      .json({ message: "Brand created successfully", brand: newBrand });
  } catch (error) {
    logger.error("Error during brand creation", {
      error: error.message,
      brandData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during brand creation",
      error: error.message,
    });
  }
};

// Update brand details
export const updateBrand = async (req, res) => {
  const brandId = req.params.id;
  const {
    companyName,
    bio,
    description,
    whatWeLookFor,
    profilePicUrl,
    backgroundImageUrl,
    popularCampaigns,
  } = req.body;

  try {
    // Find the brand by brandId
    const brand = await Brand.findByPk(brandId);

    if (!brand) {
      logger.warn("Brand update failed: Brand not found", { brandId });
      return res.status(404).json({ message: "Brand not found" });
    }

    // Update fields if provided
    if (companyName) brand.companyName = companyName;
    if (bio !== undefined) brand.bio = bio;
    if (description !== undefined) {
      brand.description = description
        ? typeof description === "string"
          ? JSON.parse(description)
          : description
        : null;
    }
    if (whatWeLookFor !== undefined) {
      brand.whatWeLookFor = whatWeLookFor
        ? typeof whatWeLookFor === "string"
          ? JSON.parse(whatWeLookFor)
          : whatWeLookFor
        : null;
    }
    if (profilePicUrl !== undefined) brand.profilePicUrl = profilePicUrl;
    if (backgroundImageUrl !== undefined)
      brand.backgroundImageUrl = backgroundImageUrl;
    if (popularCampaigns !== undefined) {
      const parsedPopularCampaigns = popularCampaigns
        ? typeof popularCampaigns === "string"
          ? JSON.parse(popularCampaigns)
          : popularCampaigns
        : [];
      // Validate popularCampaigns
      const errors = validationResult(
        req.with({ body: { popularCampaigns: parsedPopularCampaigns } })
      );
      if (!errors.isEmpty()) {
        logger.error(
          "Validation errors during brand update for popularCampaigns",
          {
            errors: errors.array(),
            brandId,
          }
        );
        return res.status(400).json({ errors: errors.array() });
      }
      brand.popularCampaigns = parsedPopularCampaigns;
    }

    await brand.save();

    logger.info("Brand updated successfully", { brandId });
    return res
      .status(200)
      .json({ message: "Brand updated successfully", brand });
  } catch (error) {
    logger.error("Error during brand update", {
      error: error.message,
      brandId,
      brandData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during brand update",
      error: error.message,
    });
  }
};

// Get brand by ID
export const getBrandById = async (req, res) => {
  const brandId = req.params.id;

  try {
    // Find the brand by brandId with status true
    const brand = await Brand.findOne({
      where: { brandId, status: true },
    });

    if (!brand) {
      logger.warn("Get brand failed: Brand not found or inactive", { brandId });
      return res.status(404).json({ message: "Brand not found or inactive" });
    }

    logger.info("Brand details retrieved successfully", { brandId });
    return res.status(200).json(brand);
  } catch (error) {
    logger.error("Error during getting brand details", {
      error: error.message,
      brandId,
    });
    return res.status(500).json({
      message: "Internal server error during getting brand details",
      error: error.message,
    });
  }
};

// Get all brands
export const getAllBrands = async (req, res) => {
  try {
    // Find all brands with status true
    const brands = await Brand.findAll({
      where: { status: true },
    });

    if (brands.length === 0) {
      logger.info("No active brands found");
      return res.status(404).json({ message: "No active brands found" });
    }

    logger.info("All active brands retrieved successfully");
    return res.status(200).json(brands);
  } catch (error) {
    logger.error("Error during getting all brands", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all brands",
      error: error.message,
    });
  }
};

// Delete a brand (soft delete)
export const deleteBrand = async (req, res) => {
  const brandId = req.params.id;

  try {
    // Find the brand by brandId
    const brand = await Brand.findByPk(brandId);

    if (!brand) {
      logger.warn("Brand deletion failed: Brand not found", { brandId });
      return res.status(404).json({ message: "Brand not found" });
    }

    // Soft delete the brand by setting status to false
    brand.status = false;
    await brand.save();

    logger.info("Brand deleted successfully", { brandId });
    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    logger.error("Error during brand deletion", {
      error: error.message,
      brandId,
    });
    return res.status(500).json({
      message: "Internal server error during brand deletion",
      error: error.message,
    });
  }
};

// Export validation rules and controller functions
export { brandCreateValidation, updatePopularCampaignsValidation };

export default {
  createBrand,
  updateBrand,
  getBrandById,
  getAllBrands,
  deleteBrand,
};
