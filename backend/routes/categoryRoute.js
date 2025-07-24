import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
  categoryValidationRules,
} from "../controllers/categoryController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Create a new category
router.post("/", verifyToken, categoryValidationRules, createCategory);

// Update an existing category
router.put(
  "/:categoryId",
  verifyToken,
  categoryValidationRules,
  updateCategory
);

// Delete a category
router.delete("/:categoryId", verifyToken, deleteCategory);

// Get a category by ID
router.get("/:categoryId", verifyToken, getCategoryById);

// Get all categories
router.get("/", verifyToken, getAllCategories);

export default router;
