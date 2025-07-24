import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT = process.env.JWT;

// Middleware to verify the JWT token and extract user information
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT);

    // Debug log to see what's in the token
    console.log("Decoded token:", decoded);

    // Try multiple possible user ID fields for backward compatibility
    const userId = decoded.userId || decoded.id || decoded.user_id;

    if (!userId) {
      console.error("Token missing user ID. Token contents:", decoded);
      return res.status(403).json({
        message: "Invalid token: missing user ID",
        debug: "Token does not contain userId, id, or user_id field",
      });
    }

    // Normalize the user object with consistent property names
    req.user = {
      userId: userId,
      id: userId, // For backward compatibility
      username: decoded.username,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    // Debug log to verify user object structure
    console.log("Verified user:", {
      userId: req.user.userId,
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    });

    next();
  } catch (error) {
    console.error("Token verification failed:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token format" });
    }

    return res.status(403).json({ message: "Invalid access token" });
  }
};

// Middleware to check if the user has the required role
export const authRole = (requiredRole) => {
  return (req, res, next) => {
    // Ensure the user object is present
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "User role not found" });
    }

    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: `Access denied. Required role: ${requiredRole}, but user has: ${req.user.role}`,
      });
    }

    next();
  };
};

// Middleware to check if the user is a influencer
export const isInfluencer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role === "influencer") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Only influencers can perform this action.",
    });
  }
};

// Middleware to check if the user is a brand
export const isBrand = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role === "brand") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Only brands can perform this action.",
    });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Only admins can perform this action.",
    });
  }
};

// Middleware to check if the user is a moderator
export const isModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role === "moderator") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Only moderators can perform this action.",
    });
  }
};

// Middleware to check if the user is the owner of the resource
export const isOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "Access denied. You are not the owner." });
  }
  next();
};

// Middleware to check if user is admin OR owner
export const isAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role === "admin" || req.user.userId === req.params.id) {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. You must be an admin or the resource owner.",
    });
  }
};
