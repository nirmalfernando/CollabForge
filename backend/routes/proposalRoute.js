import express from "express";
import {
  proposalCreateValidation,
  proposalQueryValidation,
  createProposal,
  updateProposal,
  updateProposalStatus,
  getProposalById,
  getAllProposals,
  getProposalsByCampaign,
  getProposalsByCreator,
  getProposalsByDateRange,
  getProposalsByStatus,
  deleteProposal,
} from "../controllers/proposalController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new proposal
router.post("/", verifyToken, proposalCreateValidation, createProposal);

// Get proposals by campaign ID
router.get(
  "/by-campaign",
  verifyToken,
  proposalQueryValidation,
  getProposalsByCampaign
);

// Get proposals by creator ID
router.get(
  "/by-creator",
  verifyToken,
  proposalQueryValidation,
  getProposalsByCreator
);

// Get proposals by status
router.get(
  "/by-status",
  verifyToken,
  proposalQueryValidation,
  getProposalsByStatus
);

// Get proposals by date range
router.get(
  "/by-date-range",
  verifyToken,
  proposalQueryValidation,
  getProposalsByDateRange
);

// Get a proposal by ID
router.get("/:id", verifyToken, getProposalById);

// Update a proposal by ID
router.put("/:id", verifyToken, proposalCreateValidation, updateProposal);

// Update proposal status by ID
router.put("/:id/status", verifyToken, updateProposalStatus);

// Delete a proposal by ID (soft delete)
router.delete("/:id", verifyToken, deleteProposal);

// Get all proposals
router.get("/", verifyToken, getAllProposals);

export default router;
