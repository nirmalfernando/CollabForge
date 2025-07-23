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
import {
  verifyToken,
  isAdmin,
  isOwner,
  isAdminOrOwner,
  isModerator,
} from "../middlewares/authRole.js";

const router = express.Router();

// User registration route
router.post("/register", userRegistrationValidation, registerUser);

// User login route
router.post("/login", userLoginValidation, loginUser);

// User logout route
router.post("/logout", verifyToken, isOwner, logoutUser);

// Get user by ID route
router.get("/:id", verifyToken, isAdminOrOwner, isModerator, getUserById);

// Get all users route
router.get("/", verifyToken, isAdmin, isModerator, getAllUsers);

// Update user route
router.put("/:id", verifyToken, isOwner, updateUser);

// Update user password route
router.put("/:id/password", verifyToken, isOwner, updateUserPassword);

// Delete user route
router.delete("/:id", verifyToken, isOwner, deleteUser);

export default router;
