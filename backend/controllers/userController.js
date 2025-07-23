import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

dotenv.config();

const JWT = process.env.JWT;

// Validation rules for user registration
const userRegistrationValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 255 }) // Adjusted min to 1 to match model
    .withMessage("Name must be between 1 and 255 characters long"),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 100 }) // Adjusted max to 100 to match model
    .withMessage("Username must be between 3 and 100 characters long")
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) {
        throw new Error("Username already exists");
      }
    }),
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("Email already exists");
      }
    }),
  body("password")
    .isLength({ min: 8, max: 100 }) // Added max to match model
    .withMessage("Password must be between 8 and 100 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("contactNo")
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^\+?[1-9]\d{7,14}$/)
    .withMessage(
      "Contact number must be in international format (e.g., +1234567890)"
    ),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["influencer", "brand"])
    .withMessage("Role must be either 'influencer' or 'brand'"),
];

// Register a new user
export const registerUser = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during user registration", {
      errors: errors.array(),
      userData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, username, email, password, contactNo, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      logger.warn("User registration failed: User already exists", {
        username,
        email,
      });
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const newUser = await User.create({
      id: uuidv4(),
      name,
      username,
      email,
      password: hashedPassword,
      contactNo,
      role,
      status: true, // Default status to true
    });

    logger.info("User registered successfully", {
      userId: newUser.id,
      username: newUser.username,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username, role: newUser.role },
      JWT,
      { expiresIn: "1h" }
    );

    return res
      .status(201)
      .json({ message: "User registered successfully", token });
  } catch (error) {
    logger.error("Error during user registration", {
      error: error.message,
      userData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during registration",
      error: error.message,
    });
  }
};

// Validation rules for user login
const userLoginValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// User login
export const loginUser = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during user login", {
      errors: errors.array(),
      userData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { username, status: true } });

    if (!user) {
      logger.warn("User login failed: User not found", { username });
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      logger.warn("User login failed: Incorrect password", { username });
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate a JWT token with the user's ID and role
    const userId = user.userId;

    if (!userId) {
      logger.error("User login failed: User ID is missing", { username });
      return res.status(500).json({ message: "Internal server error" });
    }

    const token = jwt.sign(
      { userId: userId, username: user.username, role: user.role },
      JWT,
      { expiresIn: "1h" }
    );

    // Send the token and the user details without password
    const { password: _, ...userDetails } = user.toJSON();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    logger.info("User logged in successfully", {
      userId: user.userId,
      username: user.username,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: userDetails,
    });
  } catch (error) {
    logger.error("Error during user login", {
      error: error.message,
      userData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during login",
      error: error.message,
    });
  }
};

// Logout a user
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    logger.info("User logged out successfully");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    logger.error("Error during user logout", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during logout",
      error: error.message,
    });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, username, email, contactNo, role, status } = req.body;

  try {
    // Find the user by userId
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn("User update failed: User not found", { userId });
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields if they are provided
    if (name) {
      user.name = name;
    }
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (contactNo) {
      user.contactNo = contactNo;
    }
    if (role) {
      user.role = role;
    }

    await user.save();

    // Exclude the password from the response
    const { password, ...updatedUserDetails } = user.toJSON();
    logger.info("User details updated successfully", {
      userId,
      updatedUserDetails,
    });
    logger.info("User updated successfully", { userId });
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    logger.error("Error during user update", {
      error: error.message,
      userId,
      userData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during user update",
      error: error.message,
    });
  }
};

// Update user password
export const updateUserPassword = async (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by userId
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn("Password update failed: User not found", { userId });
      return res.status(404).json({ message: "User not found" });
    }

    // Check old password
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      logger.warn("Password update failed: Incorrect old password", { userId });
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(12);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    logger.info("User password updated successfully", { userId });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error("Error during password update", {
      error: error.message,
      userId,
      userData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during password update",
      error: error.message,
    });
  }
};

// Get user details by userId
export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by userId with status true
    const user = await User.findOne({
      where: { id: userId, status: true },
      attributes: { exclude: ["password"] }, // Exclude password from the response
    });

    if (!user) {
      logger.warn("Get user failed: User not found or inactive", { userId });
      return res.status(404).json({ message: "User not found or inactive" });
    }

    logger.info("User details retrieved successfully", { userId });
    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error during getting user details", {
      error: error.message,
      userId,
    });
    return res.status(500).json({
      message: "Internal server error during getting user details",
      error: error.message,
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    // Find all users with status true
    const users = await User.findAll({
      where: { status: true },
      attributes: { exclude: ["password"] }, // Exclude password from the response
    });

    if (users.length === 0) {
      logger.info("No active users found");
      return res.status(404).json({ message: "No active users found" });
    }

    logger.info("All active users retrieved successfully");
    return res.status(200).json(users);
  } catch (error) {
    logger.error("Error during getting all users", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all users",
      error: error.message,
    });
  }
};

// Delete a user (soft delete)
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by userId
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn("User deletion failed: User not found", { userId });
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete the user by setting status to false
    user.status = false;
    await user.save();

    logger.info("User deleted successfully", { userId });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Error during user deletion", {
      error: error.message,
      userId,
    });
    return res.status(500).json({
      message: "Internal server error during user deletion",
      error: error.message,
    });
  }
};

// Export validation rules for use in routes
export { userRegistrationValidation, userLoginValidation };

export default {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  updateUserPassword,
  getUserById,
  getAllUsers,
  deleteUser,
};
