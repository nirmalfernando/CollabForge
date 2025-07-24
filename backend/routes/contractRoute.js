import express from "express";
import {
  contractCreateValidation,
  contractUpdateValidation,
  contractQueryValidation,
  createContract,
  updateContract,
  getContractById,
  getAllContracts,
  getContractsByCampaign,
  getContractsByBrand,
  getContractsByCreator,
  getContractsByStatus,
  getContractsByProposal,
  deleteContract,
} from "../controllers/contractController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new contract
router.post("/", verifyToken, contractCreateValidation, createContract);

// Get contracts by campaign ID
router.get(
  "/by-campaign",
  verifyToken,
  contractQueryValidation,
  getContractsByCampaign
);

// Get contracts by brand ID
router.get(
  "/by-brand",
  verifyToken,
  contractQueryValidation,
  getContractsByBrand
);

// Get contracts by creator ID
router.get(
  "/by-creator",
  verifyToken,
  contractQueryValidation,
  getContractsByCreator
);

// Get contracts by proposal ID
router.get(
  "/by-proposal",
  verifyToken,
  contractQueryValidation,
  getContractsByProposal
);

// Get contracts by status
router.get(
  "/by-status",
  verifyToken,
  contractQueryValidation,
  getContractsByStatus
);

// Get a contract by ID
router.get("/:id", verifyToken, getContractById);

// Update a contract by ID
router.put("/:id", verifyToken, contractUpdateValidation, updateContract);

// Delete a contract by ID (soft delete)
router.delete("/:id", verifyToken, deleteContract);

// Get all contracts
router.get("/", verifyToken, getAllContracts);

export default router;
