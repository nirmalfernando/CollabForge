import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  updateUserPassword,
  getUserById,
  getAllUsers,
  deleteUser,
  userRegistrationValidation,
  userLoginValidation,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// User registration route
router.post("/register", userRegistrationValidation, registerUser);

// User login route
router.post("/login", userLoginValidation, loginUser);

// User logout route
router.post("/logout", verifyToken, logoutUser);

// Get user by ID route
router.get("/:id", verifyToken, getUserById);

// Get all users route
router.get("/", verifyToken, getAllUsers);

// Update user route
router.put("/:id", verifyToken, updateUser);

// Update user password route
router.put("/:id/password", verifyToken, updateUserPassword);

// Delete user route
router.delete("/:id", verifyToken, deleteUser);

export default router;
