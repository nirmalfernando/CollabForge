import Category from "../models/Category.js";
import logger from "../middlewares/logger.js";
import { v4 as uuidv4 } from "uuid";
import { validationResult, body } from "express-validator";

// Validation rules for category creation
const categoryValidationRules = () => {
  return [
    body("categoryName")
      .notEmpty()
      .withMessage("Category name is required")
      .isLength({ max: 255 })
      .withMessage("Category name must be less than 255 characters"),
  ];
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryName } = req.body;

    // Create a new category
    const newCategory = await Category.create({
      categoryId: uuidv4(),
      categoryName,
      status: true,
    });

    logger.info("Category created successfully", newCategory);
    return res.status(201).json(newCategory);
  } catch (error) {
    logger.error("Error creating category", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing category
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, status } = req.body;

    // Find the category by ID
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category
    category.categoryName = categoryName || category.categoryName;
    category.status = status !== undefined ? status : category.status;

    await category.save();

    logger.info("Category updated successfully", category);
    return res.status(200).json(category);
  } catch (error) {
    logger.error("Error updating category", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a category by category ID
const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category by ID
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    logger.info("Category retrieved successfully", category);
    return res.status(200).json(category);
  } catch (error) {
    logger.error("Error retrieving category", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    // Retrieve all categories
    const categories = await Category.findAll();

    logger.info("Categories retrieved successfully", categories);
    return res.status(200).json(categories);
  } catch (error) {
    logger.error("Error retrieving categories", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a category by ID (soft delete)
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category by ID
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Soft delete the category
    await category.destroy();

    logger.info("Category deleted successfully", category);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    logger.error("Error deleting category", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createCategory,
  updateCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
  categoryValidationRules,
};
