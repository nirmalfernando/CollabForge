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
router.post("/", verifyToken, campaignCreateValidation, createCampaign);

// Get campaigns by brand ID
router.get(
  "/by-brand",
  verifyToken,
  campaignQueryValidation,
  getCampaignsByBrand
);

// Get campaigns by budget range
router.get(
  "/by-budget",
  verifyToken,
  campaignQueryValidation,
  getCampaignsByBudget
);

// Get campaigns by category ID
router.get(
  "/by-category",
  verifyToken,
  campaignQueryValidation,
  getCampaignsByCategory
);

// Get campaigns by status
router.get(
  "/by-status",
  verifyToken,
  campaignQueryValidation,
  getCampaignsByStatus
);

// Get a campaign by ID
router.get("/:id", verifyToken, getCampaignById);

// Update a campaign by ID
router.put("/:id", verifyToken, campaignCreateValidation, updateCampaign);

// Delete a campaign by ID (soft delete)
router.delete("/:id", verifyToken, deleteCampaign);

// Get all campaigns
router.get("/", verifyToken, getAllCampaigns);

export default router;
