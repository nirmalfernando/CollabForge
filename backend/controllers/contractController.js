import Contract from "../models/Contract.js";
import Campaign from "../models/Campaign.js";
import Brand from "../models/Brand.js";
import Creator from "../models/Creator.js";
import { body, query, validationResult } from "express-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

// Validation rules for contract creation
const contractCreateValidation = [
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
  body("brandId")
    .notEmpty()
    .withMessage("Brand ID is required")
    .isUUID(4)
    .withMessage("Brand ID must be a valid UUID")
    .custom(async (value, { req }) => {
      const brand = await Brand.findOne({
        where: { brandId: value, status: true },
      });
      if (!brand) {
        throw new Error("Brand does not exist or is inactive");
      }
      // Ensure the authenticated user is a brand and matches the brandId
      if (req.user.role !== "brand" || req.user.brandId !== value) {
        throw new Error(
          "Only the brand associated with this contract can create it"
        );
      }
    }),
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
  body("contractTitle")
    .notEmpty()
    .withMessage("Contract title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Contract title must be between 1 and 255 characters long"),
  body("contractDetails")
    .notEmpty()
    .withMessage("Contract details are required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Contract details must be between 1 and 1000 characters long"),
  body("contractSuggestions")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        JSON.parse(typeof value === "string" ? value : JSON.stringify(value));
        return true;
      } catch (error) {
        throw new Error("Contract suggestions must be a valid JSON object");
      }
    }),
  body("creatorSignature")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Creator signature must be up to 100 characters long"),
  body("signedDate")
    .optional()
    .isISO8601()
    .withMessage("Signed date must be a valid date in ISO 8601 format"),
  body("contractStatus")
    .optional()
    .isIn(["Pending", "Active", "Awaiting Payment", "Completed", "Cancelled"])
    .withMessage(
      "Contract status must be one of 'Pending', 'Active', 'Awaiting Payment', 'Completed', or 'Cancelled'"
    ),
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean value"),
];

// Validation rules for contract updates
const contractUpdateValidation = [
  body("contractTitle")
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage("Contract title must be between 1 and 255 characters long")
    .custom((value, { req }) => {
      if (value && req.user.role !== "brand") {
        throw new Error("Only brands can update contract title");
      }
      return true;
    }),
  body("contractDetails")
    .optional()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Contract details must be between 1 and 1000 characters long")
    .custom((value, { req }) => {
      if (value && req.user.role !== "brand") {
        throw new Error("Only brands can update contract details");
      }
      return true;
    }),
  body("contractSuggestions")
    .optional()
    .custom((value, { req }) => {
      if (value !== undefined && req.user.role !== "creator") {
        throw new Error("Only creators can update contract suggestions");
      }
      if (value === null) return true;
      try {
        JSON.parse(typeof value === "string" ? value : JSON.stringify(value));
        return true;
      } catch (error) {
        throw new Error("Contract suggestions must be a valid JSON object");
      }
    }),
  body("creatorSignature")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Creator signature must be up to 100 characters long")
    .custom((value, { req }) => {
      if (value && req.user.role !== "creator") {
        throw new Error("Only creators can provide a signature");
      }
      return true;
    }),
  body("contractStatus")
    .optional()
    .isIn(["Pending", "Active", "Awaiting Payment", "Completed", "Cancelled"])
    .withMessage(
      "Contract status must be one of 'Pending', 'Active', 'Awaiting Payment', 'Completed', or 'Cancelled'"
    ),
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean value"),
];

// Validation rules for contract queries
const contractQueryValidation = [
  query("campaignId")
    .optional()
    .isUUID(4)
    .withMessage("Campaign ID must be a valid UUID"),
  query("brandId")
    .optional()
    .isUUID(4)
    .withMessage("Brand ID must be a valid UUID"),
  query("creatorId")
    .optional()
    .isUUID(4)
    .withMessage("Creator ID must be a valid UUID"),
  query("contractStatus")
    .optional()
    .isIn(["Pending", "Active", "Awaiting Payment", "Completed", "Cancelled"])
    .withMessage(
      "Contract status must be one of 'Pending', 'Active', 'Awaiting Payment', 'Completed', or 'Cancelled'"
    ),
];

// Create a new contract
export const createContract = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during contract creation", {
      errors: errors.array(),
      contractData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    campaignId,
    brandId,
    creatorId,
    contractTitle,
    contractDetails,
    contractSuggestions,
    creatorSignature,
    contractStatus,
    status,
  } = req.body;

  try {
    // Parse JSON field if it is a string
    const parsedContractSuggestions = contractSuggestions
      ? typeof contractSuggestions === "string"
        ? JSON.parse(contractSuggestions)
        : contractSuggestions
      : null;

    // Set signedDate if creatorSignature is provided
    const signedDate = creatorSignature ? new Date() : null;

    // Create a new contract
    const newContract = await Contract.create({
      contractId: uuidv4(),
      campaignId,
      brandId,
      creatorId,
      contractTitle,
      contractDetails,
      contractSuggestions: parsedContractSuggestions,
      creatorSignature,
      signedDate,
      contractStatus: contractStatus || "Pending",
      status: status !== undefined ? status : true,
    });

    logger.info("Contract created successfully", {
      contractId: newContract.contractId,
      contractTitle: newContract.contractTitle,
    });

    return res
      .status(201)
      .json({
        message: "Contract created successfully",
        contract: newContract,
      });
  } catch (error) {
    logger.error("Error during contract creation", {
      error: error.message,
      contractData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during contract creation",
      error: error.message,
    });
  }
};

// Update contract details
export const updateContract = async (req, res) => {
  const contractId = req.params.id;
  const {
    contractTitle,
    contractDetails,
    contractSuggestions,
    creatorSignature,
    contractStatus,
    status,
  } = req.body;

  try {
    // Find the contract by contractId
    const contract = await Contract.findByPk(contractId);

    if (!contract) {
      logger.warn("Contract update failed: Contract not found", { contractId });
      return res.status(404).json({ message: "Contract not found" });
    }

    // Update fields if provided
    if (contractTitle) contract.contractTitle = contractTitle;
    if (contractDetails) contract.contractDetails = contractDetails;
    if (contractSuggestions !== undefined) {
      contract.contractSuggestions = contractSuggestions
        ? typeof contractSuggestions === "string"
          ? JSON.parse(contractSuggestions)
          : contractSuggestions
        : null;
    }
    if (creatorSignature) {
      contract.creatorSignature = creatorSignature;
      contract.signedDate = new Date(); // Update signedDate when creator signs
    }
    if (contractStatus) contract.contractStatus = contractStatus;
    if (status !== undefined) contract.status = status;

    await contract.save();

    logger.info("Contract updated successfully", { contractId });
    return res
      .status(200)
      .json({ message: "Contract updated successfully", contract });
  } catch (error) {
    logger.error("Error during contract update", {
      error: error.message,
      contractId,
      contractData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during contract update",
      error: error.message,
    });
  }
};

// Get contract by ID
export const getContractById = async (req, res) => {
  const contractId = req.params.id;

  try {
    // Find the contract by contractId with status true
    const contract = await Contract.findOne({
      where: { contractId, status: true },
    });

    if (!contract) {
      logger.warn("Get contract failed: Contract not found or inactive", {
        contractId,
      });
      return res
        .status(404)
        .json({ message: "Contract not found or inactive" });
    }

    logger.info("Contract details retrieved successfully", { contractId });
    return res.status(200).json(contract);
  } catch (error) {
    logger.error("Error during getting contract details", {
      error: error.message,
      contractId,
    });
    return res.status(500).json({
      message: "Internal server error during getting contract details",
      error: error.message,
    });
  }
};

// Get all contracts
export const getAllContracts = async (req, res) => {
  try {
    // Find all active contracts
    const contracts = await Contract.findAll({
      where: { status: true },
    });

    if (contracts.length === 0) {
      logger.info("No active contracts found");
      return res.status(404).json({ message: "No active contracts found" });
    }

    logger.info("All active contracts retrieved successfully");
    return res.status(200).json(contracts);
  } catch (error) {
    logger.error("Error during getting all contracts", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all contracts",
      error: error.message,
    });
  }
};

// Get contracts by campaign ID
export const getContractsByCampaign = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get contracts by campaign", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { campaignId } = req.query;

  try {
    const contracts = await Contract.findAll({
      where: { campaignId, status: true },
    });

    if (contracts.length === 0) {
      logger.info("No active contracts found for campaign", { campaignId });
      return res
        .status(404)
        .json({ message: "No active contracts found for this campaign" });
    }

    logger.info("Contracts retrieved successfully for campaign", {
      campaignId,
    });
    return res.status(200).json(contracts);
  } catch (error) {
    logger.error("Error during getting contracts by campaign", {
      error: error.message,
      campaignId,
    });
    return res.status(500).json({
      message: "Internal server error during getting contracts by campaign",
      error: error.message,
    });
  }
};

// Get contracts by brand ID
export const getContractsByBrand = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get contracts by brand", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { brandId } = req.query;

  try {
    const contracts = await Contract.findAll({
      where: { brandId, status: true },
    });

    if (contracts.length === 0) {
      logger.info("No active contracts found for brand", { brandId });
      return res
        .status(404)
        .json({ message: "No active contracts found for this brand" });
    }

    logger.info("Contracts retrieved successfully for brand", { brandId });
    return res.status(200).json(contracts);
  } catch (error) {
    logger.error("Error during getting contracts by brand", {
      error: error.message,
      brandId,
    });
    return res.status(500).json({
      message: "Internal server error during getting contracts by brand",
      error: error.message,
    });
  }
};

// Get contracts by creator ID
export const getContractsByCreator = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get contracts by creator", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { creatorId } = req.query;

  try {
    const contracts = await Contract.findAll({
      where: { creatorId, status: true },
    });

    if (contracts.length === 0) {
      logger.info("No active contracts found for creator", { creatorId });
      return res
        .status(404)
        .json({ message: "No active contracts found for this creator" });
    }

    logger.info("Contracts retrieved successfully for creator", { creatorId });
    return res.status(200).json(contracts);
  } catch (error) {
    logger.error("Error during getting contracts by creator", {
      error: error.message,
      creatorId,
    });
    return res.status(500).json({
      message: "Internal server error during getting contracts by creator",
      error: error.message,
    });
  }
};

// Get contracts by contract status
export const getContractsByStatus = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get contracts by status", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { contractStatus } = req.query;

  try {
    const contracts = await Contract.findAll({
      where: { contractStatus, status: true },
    });

    if (contracts.length === 0) {
      logger.info("No active contracts found for status", { contractStatus });
      return res
        .status(404)
        .json({ message: "No active contracts found for this status" });
    }

    logger.info("Contracts retrieved successfully for status", {
      contractStatus,
    });
    return res.status(200).json(contracts);
  } catch (error) {
    logger.error("Error during getting contracts by status", {
      error: error.message,
      contractStatus,
    });
    return res.status(500).json({
      message: "Internal server error during getting contracts by status",
      error: error.message,
    });
  }
};

// Delete a contract (soft delete)
export const deleteContract = async (req, res) => {
  const contractId = req.params.id;

  try {
    // Find the contract by contractId
    const contract = await Contract.findByPk(contractId);

    if (!contract) {
      logger.warn("Contract deletion failed: Contract not found", {
        contractId,
      });
      return res.status(404).json({ message: "Contract not found" });
    }

    // Soft delete the contract by setting status to false
    contract.status = false;
    await contract.save();

    logger.info("Contract deleted successfully", { contractId });
    return res.status(200).json({ message: "Contract deleted successfully" });
  } catch (error) {
    logger.error("Error during contract deletion", {
      error: error.message,
      contractId,
    });
    return res.status(500).json({
      message: "Internal server error during contract deletion",
      error: error.message,
    });
  }
};

// Export validation rules and controller functions
export {
  contractCreateValidation,
  contractUpdateValidation,
  contractQueryValidation,
};

export default {
  createContract,
  updateContract,
  getContractById,
  getAllContracts,
  getContractsByCampaign,
  getContractsByBrand,
  getContractsByCreator,
  getContractsByStatus,
  deleteContract,
};
