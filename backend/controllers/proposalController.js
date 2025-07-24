import Proposal from "../models/Proposal.js";
import Campaign from "../models/Campaign.js";
import Creator from "../models/Creator.js";
import { body, query, validationResult } from "express-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

// Validation rules for proposal creation
const proposalCreateValidation = [
  body("campaignId")
    .notEmpty()
    .withMessage("Campaign ID is required")
    .isUUID(4)
    .withMessage("Campaign ID must be a valid UUID")
    .custom(async (value) => {
      const campaign = await Campaign.findOne({
        where: { campaignId: value, status: true },
      });
      if (!campaign) {
        throw new Error("Campaign does not exist or is inactive");
      }
    }),
  body("proposalTitle")
    .notEmpty()
    .withMessage("Proposal title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Proposal title must be between 1 and 255 characters long"),
  body("proposalPitch")
    .notEmpty()
    .withMessage("Proposal pitch is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Proposal pitch must be between 1 and 1000 characters long"),
  body("contentPlan")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        JSON.parse(typeof value === "string" ? value : JSON.stringify(value));
        return true;
      } catch (error) {
        throw new Error("Content plan must be a valid JSON object");
      }
    }),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date in ISO 8601 format")
    .custom((value, { req }) => {
      const start = new Date(value);
      const end = req.body.endDate ? new Date(req.body.endDate) : null;
      if (end && start > end) {
        throw new Error("Start date must be before or equal to end date");
      }
      return true;
    }),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date in ISO 8601 format"),
  body("creatorId")
    .notEmpty()
    .withMessage("Creator ID is required")
    .isUUID(4)
    .withMessage("Creator ID must be a valid UUID")
    .custom(async (value) => {
      const creator = await Creator.findOne({
        where: { creatorId: value, status: true },
      });
      if (!creator) {
        throw new Error("Creator does not exist or is inactive");
      }
    }),
  body("proposalStatus")
    .optional()
    .isIn(["pending", "accepted", "rejected"])
    .withMessage(
      "Proposal status must be one of 'pending', 'accepted', or 'rejected'"
    ),
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean value"),
];

// Validation rules for proposal queries
const proposalQueryValidation = [
  query("campaignId")
    .optional()
    .isUUID(4)
    .withMessage("Campaign ID must be a valid UUID"),
  query("creatorId")
    .optional()
    .isUUID(4)
    .withMessage("Creator ID must be a valid UUID"),
  query("proposalStatus")
    .optional()
    .isIn(["pending", "accepted", "rejected"])
    .withMessage(
      "Proposal status must be one of 'pending', 'accepted', or 'rejected'"
    ),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date in ISO 8601 format"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date in ISO 8601 format")
    .custom((value, { req }) => {
      if (
        req.query.startDate &&
        new Date(value) < new Date(req.query.startDate)
      ) {
        throw new Error("End date must be after or equal to start date");
      }
      return true;
    }),
];

// Create a new proposal
export const createProposal = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during proposal creation", {
      errors: errors.array(),
      proposalData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    campaignId,
    proposalTitle,
    proposalPitch,
    contentPlan,
    startDate,
    endDate,
    creatorId,
    proposalStatus,
    status,
  } = req.body;

  try {
    // Parse JSON field if it is a string
    const parsedContentPlan = contentPlan
      ? typeof contentPlan === "string"
        ? JSON.parse(contentPlan)
        : contentPlan
      : null;

    // Create a new proposal
    const newProposal = await Proposal.create({
      proposalId: uuidv4(),
      campaignId,
      proposalTitle,
      proposalPitch,
      contentPlan: parsedContentPlan,
      startDate,
      endDate,
      creatorId,
      proposalStatus: proposalStatus || "pending", // Default to "pending" if not provided
      status: status !== undefined ? status : true, // Default to true if not provided
    });

    logger.info("Proposal created successfully", {
      proposalId: newProposal.proposalId,
      proposalTitle: newProposal.proposalTitle,
      proposalStatus: newProposal.proposalStatus,
    });

    return res.status(201).json({
      message: "Proposal created successfully",
      proposal: newProposal,
    });
  } catch (error) {
    logger.error("Error during proposal creation", {
      error: error.message,
      proposalData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during proposal creation",
      error: error.message,
    });
  }
};

// Update proposal details
export const updateProposal = async (req, res) => {
  const proposalId = req.params.id;
  const {
    campaignId,
    proposalTitle,
    proposalPitch,
    contentPlan,
    startDate,
    endDate,
    creatorId,
    proposalStatus,
    status,
  } = req.body;

  try {
    // Find the proposal by proposalId
    const proposal = await Proposal.findByPk(proposalId);

    if (!proposal) {
      logger.warn("Proposal update failed: Proposal not found", { proposalId });
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Update fields if provided
    if (campaignId) {
      const campaign = await Campaign.findOne({
        where: { campaignId, status: true },
      });
      if (!campaign) {
        logger.warn("Proposal update failed: Campaign not found or inactive", {
          campaignId,
        });
        return res
          .status(400)
          .json({ message: "Campaign not found or inactive" });
      }
      proposal.campaignId = campaignId;
    }
    if (proposalTitle) proposal.proposalTitle = proposalTitle;
    if (proposalPitch) proposal.proposalPitch = proposalPitch;
    if (contentPlan !== undefined) {
      proposal.contentPlan = contentPlan
        ? typeof contentPlan === "string"
          ? JSON.parse(contentPlan)
          : contentPlan
        : null;
    }
    if (startDate) {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date(proposal.endDate);
      if (start > end) {
        logger.warn("Proposal update failed: Start date after end date", {
          proposalId,
          startDate,
          endDate,
        });
        return res
          .status(400)
          .json({ message: "Start date must be before or equal to end date" });
      }
      proposal.startDate = startDate;
    }
    if (endDate) proposal.endDate = endDate;
    if (creatorId) {
      const creator = await Creator.findOne({
        where: { creatorId, status: true },
      });
      if (!creator) {
        logger.warn("Proposal update failed: Creator not found or inactive", {
          creatorId,
        });
        return res
          .status(400)
          .json({ message: "Creator not found or inactive" });
      }
      proposal.creatorId = creatorId;
    }
    if (proposalStatus) proposal.proposalStatus = proposalStatus;
    if (status !== undefined) proposal.status = status;

    await proposal.save();

    logger.info("Proposal updated successfully", {
      proposalId,
      proposalStatus: proposal.proposalStatus,
    });
    return res
      .status(200)
      .json({ message: "Proposal updated successfully", proposal });
  } catch (error) {
    logger.error("Error during proposal update", {
      error: error.message,
      proposalId,
      proposalData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during proposal update",
      error: error.message,
    });
  }
};

// Get proposal by ID
export const getProposalById = async (req, res) => {
  const proposalId = req.params.id;

  try {
    // Find the proposal by proposalId with status true
    const proposal = await Proposal.findOne({
      where: { proposalId, status: true },
    });

    if (!proposal) {
      logger.warn("Get proposal failed: Proposal not found or inactive", {
        proposalId,
      });
      return res
        .status(404)
        .json({ message: "Proposal not found or inactive" });
    }

    logger.info("Proposal details retrieved successfully", { proposalId });
    return res.status(200).json(proposal);
  } catch (error) {
    logger.error("Error during getting proposal details", {
      error: error.message,
      proposalId,
    });
    return res.status(500).json({
      message: "Internal server error during getting proposal details",
      error: error.message,
    });
  }
};

// Get all proposals
export const getAllProposals = async (req, res) => {
  try {
    // Find all active proposals
    const proposals = await Proposal.findAll({
      where: { status: true },
    });

    if (proposals.length === 0) {
      logger.info("No active proposals found");
      return res.status(404).json({ message: "No active proposals found" });
    }

    logger.info("All active proposals retrieved successfully");
    return res.status(200).json(proposals);
  } catch (error) {
    logger.error("Error during getting all proposals", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all proposals",
      error: error.message,
    });
  }
};

// Get proposals by campaign ID
export const getProposalsByCampaign = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get proposals by campaign", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { campaignId } = req.query;

  try {
    const proposals = await Proposal.findAll({
      where: { campaignId, status: true },
    });

    if (proposals.length === 0) {
      logger.info("No active proposals found for campaign", { campaignId });
      return res
        .status(404)
        .json({ message: "No active proposals found for this campaign" });
    }

    logger.info("Proposals retrieved successfully for campaign", {
      campaignId,
    });
    return res.status(200).json(proposals);
  } catch (error) {
    logger.error("Error during getting proposals by campaign", {
      error: error.message,
      campaignId,
    });
    return res.status(500).json({
      message: "Internal server error during getting proposals by campaign",
      error: error.message,
    });
  }
};

// Get proposals by creator ID
export const getProposalsByCreator = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get proposals by creator", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { creatorId } = req.query;

  try {
    const proposals = await Proposal.findAll({
      where: { creatorId, status: true },
    });

    if (proposals.length === 0) {
      logger.info("No active proposals found for creator", { creatorId });
      return res
        .status(404)
        .json({ message: "No active proposals found for this creator" });
    }

    logger.info("Proposals retrieved successfully for creator", { creatorId });
    return res.status(200).json(proposals);
  } catch (error) {
    logger.error("Error during getting proposals by creator", {
      error: error.message,
      creatorId,
    });
    return res.status(500).json({
      message: "Internal server error during getting proposals by creator",
      error: error.message,
    });
  }
};

// Get proposals by proposal status
export const getProposalsByStatus = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get proposals by status", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { proposalStatus } = req.query;

  try {
    const proposals = await Proposal.findAll({
      where: { proposalStatus, status: true },
    });

    if (proposals.length === 0) {
      logger.info("No active proposals found for status", { proposalStatus });
      return res.status(404).json({
        message: `No active proposals found with status '${proposalStatus}'`,
      });
    }

    logger.info("Proposals retrieved successfully for status", {
      proposalStatus,
      count: proposals.length,
    });
    return res.status(200).json(proposals);
  } catch (error) {
    logger.error("Error during getting proposals by status", {
      error: error.message,
      proposalStatus,
    });
    return res.status(500).json({
      message: "Internal server error during getting proposals by status",
      error: error.message,
    });
  }
};

// Get proposals by date range
export const getProposalsByDateRange = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get proposals by date range", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { startDate, endDate } = req.query;

  try {
    const where = { status: true };
    if (startDate) where.startDate = { [Op.gte]: new Date(startDate) };
    if (endDate) where.endDate = { [Op.lte]: new Date(endDate) };

    const proposals = await Proposal.findAll({ where });

    if (proposals.length === 0) {
      logger.info("No active proposals found for date range", {
        startDate,
        endDate,
      });
      return res
        .status(404)
        .json({ message: "No active proposals found for this date range" });
    }

    logger.info("Proposals retrieved successfully for date range", {
      startDate,
      endDate,
    });
    return res.status(200).json(proposals);
  } catch (error) {
    logger.error("Error during getting proposals by date range", {
      error: error.message,
      startDate,
      endDate,
    });
    return res.status(500).json({
      message: "Internal server error during getting proposals by date range",
      error: error.message,
    });
  }
};

// Update proposal status only (for approving/rejecting proposals)
export const updateProposalStatus = async (req, res) => {
  const proposalId = req.params.id;
  const { proposalStatus } = req.body;

  // Validate proposalStatus
  if (
    !proposalStatus ||
    !["pending", "accepted", "rejected"].includes(proposalStatus)
  ) {
    logger.warn("Invalid proposal status provided", {
      proposalId,
      proposalStatus,
    });
    return res.status(400).json({
      message:
        "Proposal status must be one of 'pending', 'accepted', or 'rejected'",
    });
  }

  try {
    // Find the proposal by proposalId
    const proposal = await Proposal.findByPk(proposalId);

    if (!proposal) {
      logger.warn("Proposal status update failed: Proposal not found", {
        proposalId,
      });
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Update only the proposal status
    proposal.proposalStatus = proposalStatus;
    await proposal.save();

    logger.info("Proposal status updated successfully", {
      proposalId,
      newStatus: proposalStatus,
    });
    return res.status(200).json({
      message: "Proposal status updated successfully",
      proposalId,
      proposalStatus: proposal.proposalStatus,
    });
  } catch (error) {
    logger.error("Error during proposal status update", {
      error: error.message,
      proposalId,
      proposalStatus,
    });
    return res.status(500).json({
      message: "Internal server error during proposal status update",
      error: error.message,
    });
  }
};

// Delete a proposal (soft delete)
export const deleteProposal = async (req, res) => {
  const proposalId = req.params.id;

  try {
    // Find the proposal by proposalId
    const proposal = await Proposal.findByPk(proposalId);

    if (!proposal) {
      logger.warn("Proposal deletion failed: Proposal not found", {
        proposalId,
      });
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Soft delete the proposal by setting status to false
    proposal.status = false;
    await proposal.save();

    logger.info("Proposal deleted successfully", { proposalId });
    return res.status(200).json({ message: "Proposal deleted successfully" });
  } catch (error) {
    logger.error("Error during proposal deletion", {
      error: error.message,
      proposalId,
    });
    return res.status(500).json({
      message: "Internal server error during proposal deletion",
      error: error.message,
    });
  }
};

// Export validation rules and controller functions
export { proposalCreateValidation, proposalQueryValidation };

export default {
  createProposal,
  updateProposal,
  getProposalById,
  getAllProposals,
  getProposalsByCampaign,
  getProposalsByCreator,
  getProposalsByStatus,
  getProposalsByDateRange,
  updateProposalStatus,
  deleteProposal,
};
