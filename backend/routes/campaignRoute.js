import express from "express";
import {
  campaignCreateValidation,
  campaignQueryValidation,
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignsByBrand,
  getCampaignsByBudget,
  getCampaignsByCategory,
  getCampaignsByStatus,
} from "../controllers/campaignController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new campaign
router.post("/", campaignCreateValidation, verifyToken, createCampaign);

// Get a campaign by ID
router.get("/:id", verifyToken, getCampaignById);

// Update a campaign by ID
router.put("/:id", campaignCreateValidation, verifyToken, updateCampaign);

// Delete a campaign by ID (soft delete)
router.delete("/:id", verifyToken, deleteCampaign);

// Get all campaigns
router.get("/", verifyToken, getAllCampaigns);

// Get campaigns by brand ID
router.get(
  "/by-brand",
  campaignQueryValidation,
  verifyToken,
  getCampaignsByBrand
);

// Get campaigns by budget range
router.get(
  "/by-budget",
  campaignQueryValidation,
  verifyToken,
  getCampaignsByBudget
);

// Get campaigns by category ID
router.get(
  "/by-category",
  campaignQueryValidation,
  verifyToken,
  getCampaignsByCategory
);

// Get campaigns by status
router.get(
  "/by-status",
  campaignQueryValidation,
  verifyToken,
  getCampaignsByStatus
);

export default router;
