import express from "express";
import {
  proposalCreateValidation,
  proposalQueryValidation,
  createProposal,
  updateProposal,
  getProposalById,
  getAllProposals,
  getProposalsByCampaign,
  getProposalsByCreator,
  getProposalsByDateRange,
  deleteProposal,
} from "../controllers/proposalController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new proposal
router.post("/", proposalCreateValidation, verifyToken, createProposal);

// Get a proposal by ID
router.get("/:id", verifyToken, getProposalById);

// Update a proposal by ID
router.put("/:id", proposalCreateValidation, verifyToken, updateProposal);

// Delete a proposal by ID (soft delete)
router.delete("/:id", verifyToken, deleteProposal);

// Get all proposals
router.get("/", verifyToken, getAllProposals);

// Get proposals by campaign ID
router.get(
  "/by-campaign",
  proposalQueryValidation,
  verifyToken,
  getProposalsByCampaign
);

// Get proposals by creator ID
router.get(
  "/by-creator",
  proposalQueryValidation,
  verifyToken,
  getProposalsByCreator
);

// Get proposals by date range
router.get(
  "/by-date-range",
  proposalQueryValidation,
  verifyToken,
  getProposalsByDateRange
);

export default router;
