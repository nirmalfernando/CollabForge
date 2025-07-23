import Campaign from "../models/Campaign.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import { body, query, validationResult } from "express-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

// Validation rules for campaign creation
const campaignCreateValidation = [
  body("campaignTitle")
    .notEmpty()
    .withMessage("Campaign title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Campaign title must be between 1 and 255 characters long"),
  body("budget")
    .notEmpty()
    .withMessage("Budget is required")
    .isFloat({ min: 0 })
    .withMessage("Budget must be a positive number"),
  body("campaignStatus")
    .notEmpty()
    .withMessage("Campaign status is required")
    .isIn(["draft", "active", "completed", "cancelled"])
    .withMessage(
      "Campaign status must be one of 'draft', 'active', 'completed', or 'cancelled'"
    ),
  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isUUID(4)
    .withMessage("Category ID must be a valid UUID")
    .custom(async (value) => {
      const category = await Category.findOne({
        where: { categoryId: value, status: true },
      });
      if (!category) {
        throw new Error("Category does not exist or is inactive");
      }
    }),
  body("requirements")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        JSON.parse(typeof value === "string" ? value : JSON.stringify(value));
        return true;
      } catch (error) {
        throw new Error("Requirements must be a valid JSON object");
      }
    }),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be up to 500 characters long"),
  body("brandId")
    .notEmpty()
    .withMessage("Brand ID is required")
    .isUUID(4)
    .withMessage("Brand ID must be a valid UUID")
    .custom(async (value) => {
      const brand = await Brand.findOne({
        where: { brandId: value, status: true },
      });
      if (!brand) {
        throw new Error("Brand does not exist or is inactive");
      }
    }),
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean value"),
];

// Validation rules for campaign queries (used in getByCategory, getByBrand, getByStatus, getByBudget)
const campaignQueryValidation = [
  query("categoryId")
    .optional()
    .isUUID(4)
    .withMessage("Category ID must be a valid UUID"),
  query("brandId")
    .optional()
    .isUUID(4)
    .withMessage("Brand ID must be a valid UUID"),
  query("campaignStatus")
    .optional()
    .isIn(["draft", "active", "completed", "cancelled"])
    .withMessage(
      "Campaign status must be one of 'draft', 'active', 'completed', or 'cancelled'"
    ),
  query("minBudget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum budget must be a positive number"),
  query("maxBudget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum budget must be a positive number")
    .custom((value, { req }) => {
      if (req.query.minBudget && value < parseFloat(req.query.minBudget)) {
        throw new Error(
          "Maximum budget must be greater than or equal to minimum budget"
        );
      }
      return true;
    }),
];

// Create a new campaign
export const createCampaign = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during campaign creation", {
      errors: errors.array(),
      campaignData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    campaignTitle,
    budget,
    campaignStatus,
    categoryId,
    requirements,
    description,
    brandId,
    status,
  } = req.body;

  try {
    // Parse JSON field if it is a string
    const parsedRequirements = requirements
      ? typeof requirements === "string"
        ? JSON.parse(requirements)
        : requirements
      : null;

    // Create a new campaign
    const newCampaign = await Campaign.create({
      campaignId: uuidv4(),
      campaignTitle,
      budget,
      campaignStatus,
      categoryId,
      requirements: parsedRequirements,
      description,
      brandId,
      status: status !== undefined ? status : true, // Default to true if not provided
    });

    logger.info("Campaign created successfully", {
      campaignId: newCampaign.campaignId,
      campaignTitle: newCampaign.campaignTitle,
    });

    return res
      .status(201)
      .json({
        message: "Campaign created successfully",
        campaign: newCampaign,
      });
  } catch (error) {
    logger.error("Error during campaign creation", {
      error: error.message,
      campaignData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during campaign creation",
      error: error.message,
    });
  }
};

// Update campaign details
export const updateCampaign = async (req, res) => {
  const campaignId = req.params.id;
  const {
    campaignTitle,
    budget,
    campaignStatus,
    categoryId,
    requirements,
    description,
    brandId,
    status,
  } = req.body;

  try {
    // Find the campaign by campaignId
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      logger.warn("Campaign update failed: Campaign not found", { campaignId });
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Update fields if provided
    if (campaignTitle) campaign.campaignTitle = campaignTitle;
    if (budget !== undefined) campaign.budget = budget;
    if (campaignStatus) campaign.campaignStatus = campaignStatus;
    if (categoryId) {
      const category = await Category.findOne({
        where: { categoryId, status: true },
      });
      if (!category) {
        logger.warn("Campaign update failed: Category not found or inactive", {
          categoryId,
        });
        return res
          .status(400)
          .json({ message: "Category not found or inactive" });
      }
      campaign.categoryId = categoryId;
    }
    if (requirements !== undefined) {
      campaign.requirements = requirements
        ? typeof requirements === "string"
          ? JSON.parse(requirements)
          : requirements
        : null;
    }
    if (description !== undefined) campaign.description = description;
    if (brandId) {
      const brand = await Brand.findOne({ where: { brandId, status: true } });
      if (!brand) {
        logger.warn("Campaign update failed: Brand not found or inactive", {
          brandId,
        });
        return res.status(400).json({ message: "Brand not found or inactive" });
      }
      campaign.brandId = brandId;
    }
    if (status !== undefined) campaign.status = status;

    await campaign.save();

    logger.info("Campaign updated successfully", { campaignId });
    return res
      .status(200)
      .json({ message: "Campaign updated successfully", campaign });
  } catch (error) {
    logger.error("Error during campaign update", {
      error: error.message,
      campaignId,
      campaignData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during campaign update",
      error: error.message,
    });
  }
};

// Get campaign by ID
export const getCampaignById = async (req, res) => {
  const campaignId = req.params.id;

  try {
    // Find the campaign by campaignId with status true
    const campaign = await Campaign.findOne({
      where: { campaignId, status: true },
    });

    if (!campaign) {
      logger.warn("Get campaign failed: Campaign not found or inactive", {
        campaignId,
      });
      return res
        .status(404)
        .json({ message: "Campaign not found or inactive" });
    }

    logger.info("Campaign details retrieved successfully", { campaignId });
    return res.status(200).json(campaign);
  } catch (error) {
    logger.error("Error during getting campaign details", {
      error: error.message,
      campaignId,
    });
    return res.status(500).json({
      message: "Internal server error during getting campaign details",
      error: error.message,
    });
  }
};

// Get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    // Find all active campaigns
    const campaigns = await Campaign.findAll({
      where: { status: true },
    });

    if (campaigns.length === 0) {
      logger.info("No active campaigns found");
      return res.status(404).json({ message: "No active campaigns found" });
    }

    logger.info("All active campaigns retrieved successfully");
    return res.status(200).json(campaigns);
  } catch (error) {
    logger.error("Error during getting all campaigns", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all campaigns",
      error: error.message,
    });
  }
};

// Get campaigns by category
export const getCampaignsByCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get campaigns by category", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryId } = req.query;

  try {
    const campaigns = await Campaign.findAll({
      where: { categoryId, status: true },
    });

    if (campaigns.length === 0) {
      logger.info("No active campaigns found for category", { categoryId });
      return res
        .status(404)
        .json({ message: "No active campaigns found for this category" });
    }

    logger.info("Campaigns retrieved successfully for category", {
      categoryId,
    });
    return res.status(200).json(campaigns);
  } catch (error) {
    logger.error("Error during getting campaigns by category", {
      error: error.message,
      categoryId,
    });
    return res.status(500).json({
      message: "Internal server error during getting campaigns by category",
      error: error.message,
    });
  }
};

// Get campaigns by brand
export const getCampaignsByBrand = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get campaigns by brand", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { brandId } = req.query;

  try {
    const campaigns = await Campaign.findAll({
      where: { brandId, status: true },
    });

    if (campaigns.length === 0) {
      logger.info("No active campaigns found for brand", { brandId });
      return res
        .status(404)
        .json({ message: "No active campaigns found for this brand" });
    }

    logger.info("Campaigns retrieved successfully for brand", { brandId });
    return res.status(200).json(campaigns);
  } catch (error) {
    logger.error("Error during getting campaigns by brand", {
      error: error.message,
      brandId,
    });
    return res.status(500).json({
      message: "Internal server error during getting campaigns by brand",
      error: error.message,
    });
  }
};

// Get campaigns by status
export const getCampaignsByStatus = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get campaigns by status", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { campaignStatus } = req.query;

  try {
    const campaigns = await Campaign.findAll({
      where: { campaignStatus, status: true },
    });

    if (campaigns.length === 0) {
      logger.info("No active campaigns found for status", { campaignStatus });
      return res
        .status(404)
        .json({ message: "No active campaigns found for this status" });
    }

    logger.info("Campaigns retrieved successfully for status", {
      campaignStatus,
    });
    return res.status(200).json(campaigns);
  } catch (error) {
    logger.error("Error during getting campaigns by status", {
      error: error.message,
      campaignStatus,
    });
    return res.status(500).json({
      message: "Internal server error during getting campaigns by status",
      error: error.message,
    });
  }
};

// Get campaigns by budget range
export const getCampaignsByBudget = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get campaigns by budget", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { minBudget, maxBudget } = req.query;

  try {
    const where = { status: true };
    if (minBudget) where.budget = { [Op.gte]: parseFloat(minBudget) };
    if (maxBudget)
      where.budget = { ...where.budget, [Op.lte]: parseFloat(maxBudget) };

    const campaigns = await Campaign.findAll({ where });

    if (campaigns.length === 0) {
      logger.info("No active campaigns found for budget range", {
        minBudget,
        maxBudget,
      });
      return res
        .status(404)
        .json({ message: "No active campaigns found for this budget range" });
    }

    logger.info("Campaigns retrieved successfully for budget range", {
      minBudget,
      maxBudget,
    });
    return res.status(200).json(campaigns);
  } catch (error) {
    logger.error("Error during getting campaigns by budget", {
      error: error.message,
      minBudget,
      maxBudget,
    });
    return res.status(500).json({
      message: "Internal server error during getting campaigns by budget",
      error: error.message,
    });
  }
};

// Delete a campaign (soft delete)
export const deleteCampaign = async (req, res) => {
  const campaignId = req.params.id;

  try {
    // Find the campaign by campaignId
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      logger.warn("Campaign deletion failed: Campaign not found", {
        campaignId,
      });
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Soft delete the campaign by setting status to false
    campaign.status = false;
    await campaign.save();

    logger.info("Campaign deleted successfully", { campaignId });
    return res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    logger.error("Error during campaign deletion", {
      error: error.message,
      campaignId,
    });
    return res.status(500).json({
      message: "Internal server error during campaign deletion",
      error: error.message,
    });
  }
};

// Export validation rules and controller functions
export { campaignCreateValidation, campaignQueryValidation };

export default {
  createCampaign,
  updateCampaign,
  getCampaignById,
  getAllCampaigns,
  getCampaignsByCategory,
  getCampaignsByBrand,
  getCampaignsByStatus,
  getCampaignsByBudget,
  deleteCampaign,
};
