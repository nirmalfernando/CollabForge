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
  deleteContract,
} from "../controllers/contractController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new contract
router.post("/", contractCreateValidation, verifyToken, createContract);

// Get a contract by ID
router.get("/:id", verifyToken, getContractById);

// Update a contract by ID
router.put("/:id", contractUpdateValidation, verifyToken, updateContract);

// Delete a contract by ID (soft delete)
router.delete("/:id", verifyToken, deleteContract);

// Get all contracts
router.get("/", verifyToken, getAllContracts);

// Get contracts by campaign ID
router.get(
  "/by-campaign",
  contractQueryValidation,
  verifyToken,
  getContractsByCampaign
);

// Get contracts by brand ID
router.get(
  "/by-brand",
  contractQueryValidation,
  verifyToken,
  getContractsByBrand
);

// Get contracts by creator ID
router.get(
  "/by-creator",
  contractQueryValidation,
  verifyToken,
  getContractsByCreator
);

// Get contracts by status
router.get(
  "/by-status",
  contractQueryValidation,
  verifyToken,
  getContractsByStatus
);

export default router;
