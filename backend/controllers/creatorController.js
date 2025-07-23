import Creator from "../models/Creator.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Campaign from "../models/Campaign.js";
import Contract from "../models/Contract.js";
import { body, param, validationResult } from "express-validator";
import { Op } from "sequelize";
import logger from "../middlewares/logger.js";

// Validation rules for creator creation
const creatorCreateValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID(4)
    .withMessage("User ID must be a valid UUID")
    .custom(async (value, { req }) => {
      const user = await User.findOne({
        where: { userId: value, status: true },
      });
      if (!user) {
        throw new Error("Associated user does not exist or is inactive");
      }
      if (req.user.role !== "creator" || req.user.userId !== value) {
        throw new Error(
          "Only the authenticated user can create their creator profile"
        );
      }
      const existingCreator = await Creator.findOne({
        where: { creatorId: value },
      });
      if (existingCreator) {
        throw new Error("A creator profile already exists for this user");
      }
    }),
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters long"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be between 1 and 100 characters long"),
  body("nickName")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Nickname must be up to 100 characters long"),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio must be up to 500 characters long"),
  body("details")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("Details must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each detail must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("Details must be a valid JSON array of objects");
      }
    }),
  body("socialMedia")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("Social media must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each social media entry must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("Social media must be a valid JSON array of objects");
      }
    }),
  body("whatIDo")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("What I do must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each entry in 'What I do' must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("What I do must be a valid JSON array of objects");
      }
    }),
  body("myPeople")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("My people must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each entry in 'My people' must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("My people must be a valid JSON array of objects");
      }
    }),
  body("myContent")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("My content must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each entry in 'My content' must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("My content must be a valid JSON array of objects");
      }
    }),
  body("pastCollaborations")
    .optional()
    .custom(async (value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("Past collaborations must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each past collaboration must be an object");
          }
        });
        const campaignIds = parsed
          .filter((item) => item.campaignId)
          .map((item) => item.campaignId);
        const contractIds = parsed
          .filter((item) => item.contractId)
          .map((item) => item.contractId);
        if (campaignIds.length > 0) {
          const campaigns = await Campaign.findAll({
            where: { campaignId: { [Op.in]: campaignIds }, status: true },
          });
          if (campaigns.length !== campaignIds.length) {
            throw new Error("One or more campaign IDs are invalid or inactive");
          }
        }
        if (contractIds.length > 0) {
          const contracts = await Contract.findAll({
            where: { contractId: { [Op.in]: contractIds }, status: true },
          });
          if (contracts.length !== contractIds.length) {
            throw new Error("One or more contract IDs are invalid or inactive");
          }
        }
        return true;
      } catch (error) {
        throw new Error(
          "Past collaborations must be a valid JSON array of objects: " +
            error.message
        );
      }
    }),
  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isUUID(4)
    .withMessage("Category ID must be a valid UUID")
    .custom(async (value) => {
      const category = await Category.findOne({
        where: { categoryId: value, status: true },
      });
      if (!category) {
        throw new Error("Category does not exist or is inactive");
      }
    }),
  body("profilePicUrl")
    .optional()
    .isURL()
    .withMessage("Profile picture URL must be a valid URL"),
  body("backgroundImgUrl")
    .optional()
    .isURL()
    .withMessage("Background image URL must be a valid URL"),
  body("accountNumber")
    .optional()
    .isAlphanumeric()
    .withMessage("Account number must be alphanumeric")
    .isLength({ min: 1, max: 50 })
    .withMessage("Account number must be between 1 and 50 characters long"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["Content Creator", "Model", "Live Streamer"])
    .withMessage(
      "Type must be one of 'Content Creator', 'Model', or 'Live Streamer'"
    ),
];

// Validation rules for creator update
const creatorUpdateValidation = [
  body("firstName")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters long"),
  body("lastName")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be between 1 and 100 characters long"),
  body("nickName")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Nickname must be up to 100 characters long"),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio must be up to 500 characters long"),
  body("details")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("Details must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each detail must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("Details must be a valid JSON array of objects");
      }
    }),
  body("socialMedia")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("Social media must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each social media entry must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("Social media must be a valid JSON array of objects");
      }
    }),
  body("whatIDo")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("What I do must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each entry in 'What I do' must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("What I do must be a valid JSON array of objects");
      }
    }),
  body("myPeople")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("My people must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each entry in 'My people' must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("My people must be a valid JSON array of objects");
      }
    }),
  body("myContent")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("My content must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each entry in 'My content' must be an object");
          }
        });
        return true;
      } catch (error) {
        throw new Error("My content must be a valid JSON array of objects");
      }
    }),
  body("pastCollaborations")
    .optional()
    .custom(async (value) => {
      if (value === undefined || value === null) return true;
      try {
        const parsed = JSON.parse(
          typeof value === "string" ? value : JSON.stringify(value)
        );
        if (!Array.isArray(parsed)) {
          throw new Error("Past collaborations must be an array of objects");
        }
        parsed.forEach((item) => {
          if (typeof item !== "object" || Array.isArray(item)) {
            throw new Error("Each past collaboration must be an object");
          }
        });
        const campaignIds = parsed
          .filter((item) => item.campaignId)
          .map((item) => item.campaignId);
        const contractIds = parsed
          .filter((item) => item.contractId)
          .map((item) => item.contractId);
        if (campaignIds.length > 0) {
          const campaigns = await Campaign.findAll({
            where: { campaignId: { [Op.in]: campaignIds }, status: true },
          });
          if (campaigns.length !== campaignIds.length) {
            throw new Error("One or more campaign IDs are invalid or inactive");
          }
        }
        if (contractIds.length > 0) {
          const contracts = await Contract.findAll({
            where: { contractId: { [Op.in]: contractIds }, status: true },
          });
          if (contracts.length !== contractIds.length) {
            throw new Error("One or more contract IDs are invalid or inactive");
          }
        }
        return true;
      } catch (error) {
        throw new Error(
          "Past collaborations must be a valid JSON array of objects: " +
            error.message
        );
      }
    }),
  body("categoryId")
    .optional()
    .isUUID(4)
    .withMessage("Category ID must be a valid UUID")
    .custom(async (value) => {
      if (value === undefined || value === null) return true;
      const category = await Category.findOne({
        where: { categoryId: value, status: true },
      });
      if (!category) {
        throw new Error("Category does not exist or is inactive");
      }
    }),
  body("profilePicUrl")
    .optional()
    .isURL()
    .withMessage("Profile picture URL must be a valid URL"),
  body("backgroundImgUrl")
    .optional()
    .isURL()
    .withMessage("Background image URL must be a valid URL"),
  body("accountNumber")
    .optional()
    .isAlphanumeric()
    .withMessage("Account number must be alphanumeric")
    .isLength({ min: 1, max: 50 })
    .withMessage("Account number must be between 1 and 50 characters long"),
  body("type")
    .optional()
    .isIn(["Content Creator", "Model", "Live Streamer"])
    .withMessage(
      "Type must be one of 'Content Creator', 'Model', or 'Live Streamer'"
    ),
];

// Validation rules for query parameters
const creatorQueryValidation = [
  param("categoryId")
    .optional()
    .isUUID(4)
    .withMessage("Category ID must be a valid UUID"),
  param("type")
    .optional()
    .isIn(["Content Creator", "Model", "Live Streamer"])
    .withMessage(
      "Type must be one of 'Content Creator', 'Model', or 'Live Streamer'"
    ),
  param("userId")
    .optional()
    .isUUID(4)
    .withMessage("User ID must be a valid UUID"),
];

// Create a new creator
export const createCreator = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during creator creation", {
      errors: errors.array(),
      creatorData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    userId,
    firstName,
    lastName,
    nickName,
    bio,
    details,
    socialMedia,
    whatIDo,
    myPeople,
    myContent,
    pastCollaborations,
    categoryId,
    profilePicUrl,
    backgroundImgUrl,
    accountNumber,
    type,
  } = req.body;

  try {
    // Parse JSON fields if they are strings
    const parsedDetails = details
      ? typeof details === "string"
        ? JSON.parse(details)
        : details
      : [];
    const parsedSocialMedia = socialMedia
      ? typeof socialMedia === "string"
        ? JSON.parse(socialMedia)
        : socialMedia
      : [];
    const parsedWhatIDo = whatIDo
      ? typeof whatIDo === "string"
        ? JSON.parse(whatIDo)
        : whatIDo
      : [];
    const parsedMyPeople = myPeople
      ? typeof myPeople === "string"
        ? JSON.parse(myPeople)
        : myPeople
      : [];
    const parsedMyContent = myContent
      ? typeof myContent === "string"
        ? JSON.parse(myContent)
        : myContent
      : [];
    const parsedPastCollaborations = pastCollaborations
      ? typeof pastCollaborations === "string"
        ? JSON.parse(pastCollaborations)
        : pastCollaborations
      : [];

    // Create a new creator
    const newCreator = await Creator.create({
      creatorId: userId, // Use userId as creatorId due to one-to-one relationship
      firstName,
      lastName,
      nickName,
      bio,
      details: parsedDetails,
      socialMedia: parsedSocialMedia,
      whatIDo: parsedWhatIDo,
      myPeople: parsedMyPeople,
      myContent: parsedMyContent,
      pastCollaborations: parsedPastCollaborations,
      categoryId,
      profilePicUrl,
      backgroundImgUrl,
      accountNumber,
      type,
      status: true,
    });

    logger.info("Creator created successfully", {
      creatorId: newCreator.creatorId,
      firstName: newCreator.firstName,
      lastName: newCreator.lastName,
    });

    return res
      .status(201)
      .json({ message: "Creator created successfully", creator: newCreator });
  } catch (error) {
    logger.error("Error during creator creation", {
      error: error.message,
      creatorData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during creator creation",
      error: error.message,
    });
  }
};

// Update creator details
export const updateCreator = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during creator update", {
      errors: errors.array(),
      creatorId: req.params.id,
      creatorData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const creatorId = req.params.id;
  const {
    firstName,
    lastName,
    nickName,
    bio,
    details,
    socialMedia,
    whatIDo,
    myPeople,
    myContent,
    pastCollaborations,
    categoryId,
    profilePicUrl,
    backgroundImgUrl,
    accountNumber,
    type,
  } = req.body;

  try {
    // Find the creator by creatorId
    const creator = await Creator.findByPk(creatorId);

    if (!creator) {
      logger.warn("Creator update failed: Creator not found", { creatorId });
      return res.status(404).json({ message: "Creator not found" });
    }

    // Ensure authenticated user matches creatorId
    if (req.user.role !== "creator" || req.user.userId !== creatorId) {
      logger.warn("Creator update failed: Unauthorized", {
        creatorId,
        userId: req.user.userId,
      });
      return res
        .status(403)
        .json({ message: "Unauthorized to update this creator" });
    }

    // Update fields if provided
    if (firstName) creator.firstName = firstName;
    if (lastName) creator.lastName = lastName;
    if (nickName !== undefined) creator.nickName = nickName;
    if (bio !== undefined) creator.bio = bio;
    if (details !== undefined) {
      creator.details = details
        ? typeof details === "string"
          ? JSON.parse(details)
          : details
        : [];
    }
    if (socialMedia !== undefined) {
      creator.socialMedia = socialMedia
        ? typeof socialMedia === "string"
          ? JSON.parse(socialMedia)
          : socialMedia
        : [];
    }
    if (whatIDo !== undefined) {
      creator.whatIDo = whatIDo
        ? typeof whatIDo === "string"
          ? JSON.parse(whatIDo)
          : whatIDo
        : [];
    }
    if (myPeople !== undefined) {
      creator.myPeople = myPeople
        ? typeof myPeople === "string"
          ? JSON.parse(myPeople)
          : myPeople
        : [];
    }
    if (myContent !== undefined) {
      creator.myContent = myContent
        ? typeof myContent === "string"
          ? JSON.parse(myContent)
          : myContent
        : [];
    }
    if (pastCollaborations !== undefined) {
      creator.pastCollaborations = pastCollaborations
        ? typeof pastCollaborations === "string"
          ? JSON.parse(pastCollaborations)
          : pastCollaborations
        : [];
    }
    if (categoryId) {
      const category = await Category.findOne({
        where: { categoryId, status: true },
      });
      if (!category) {
        logger.warn("Creator update failed: Category not found or inactive", {
          categoryId,
        });
        return res
          .status(400)
          .json({ message: "Category not found or inactive" });
      }
      creator.categoryId = categoryId;
    }
    if (profilePicUrl !== undefined) creator.profilePicUrl = profilePicUrl;
    if (backgroundImgUrl !== undefined)
      creator.backgroundImgUrl = backgroundImgUrl;
    if (accountNumber !== undefined) creator.accountNumber = accountNumber;
    if (type) creator.type = type;

    await creator.save();

    logger.info("Creator updated successfully", { creatorId });
    return res
      .status(200)
      .json({ message: "Creator updated successfully", creator });
  } catch (error) {
    logger.error("Error during creator update", {
      error: error.message,
      creatorId,
      creatorData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during creator update",
      error: error.message,
    });
  }
};

// Get creator by ID
export const getCreatorById = async (req, res) => {
  const creatorId = req.params.id;

  try {
    // Find the creator by creatorId with status true
    const creator = await Creator.findOne({
      where: { creatorId, status: true },
    });

    if (!creator) {
      logger.warn("Get creator failed: Creator not found or inactive", {
        creatorId,
      });
      return res.status(404).json({ message: "Creator not found or inactive" });
    }

    logger.info("Creator details retrieved successfully", { creatorId });
    return res.status(200).json(creator);
  } catch (error) {
    logger.error("Error during getting creator details", {
      error: error.message,
      creatorId,
    });
    return res.status(500).json({
      message: "Internal server error during getting creator details",
      error: error.message,
    });
  }
};

// Get creator by user ID
export const getCreatorByUserId = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get creator by user ID", {
      errors: errors.array(),
      userId: req.params.userId,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.params;

  try {
    // Find the creator by userId with status true
    const creator = await Creator.findOne({
      where: { creatorId: userId, status: true },
    });

    if (!creator) {
      logger.warn("Get creator failed: Creator not found or inactive", {
        userId,
      });
      return res
        .status(404)
        .json({ message: "Creator not found or inactive for this user" });
    }

    logger.info("Creator retrieved successfully for user", { userId });
    return res.status(200).json(creator);
  } catch (error) {
    logger.error("Error during getting creator by user ID", {
      error: error.message,
      userId,
    });
    return res.status(500).json({
      message: "Internal server error during getting creator by user ID",
      error: error.message,
    });
  }
};

// Get all creators
export const getAllCreators = async (req, res) => {
  try {
    // Find all creators with status true
    const creators = await Creator.findAll({
      where: { status: true },
    });

    if (creators.length === 0) {
      logger.info("No active creators found");
      return res.status(404).json({ message: "No active creators found" });
    }

    logger.info("All active creators retrieved successfully");
    return res.status(200).json(creators);
  } catch (error) {
    logger.error("Error during getting all creators", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all creators",
      error: error.message,
    });
  }
};

// Get creators by category
export const getCreatorsByCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get creators by category", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryId } = req.query;

  try {
    const creators = await Creator.findAll({
      where: { categoryId, status: true },
    });

    if (creators.length === 0) {
      logger.info("No active creators found for category", { categoryId });
      return res
        .status(404)
        .json({ message: "No active creators found for this category" });
    }

    logger.info("Creators retrieved successfully for category", { categoryId });
    return res.status(200).json(creators);
  } catch (error) {
    logger.error("Error during getting creators by category", {
      error: error.message,
      categoryId,
    });
    return res.status(500).json({
      message: "Internal server error during getting creators by category",
      error: error.message,
    });
  }
};

// Get creators by type
export const getCreatorsByType = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get creators by type", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { type } = req.query;

  try {
    const creators = await Creator.findAll({
      where: { type, status: true },
    });

    if (creators.length === 0) {
      logger.info("No active creators found for type", { type });
      return res
        .status(404)
        .json({ message: "No active creators found for this type" });
    }

    logger.info("Creators retrieved successfully for type", { type });
    return res.status(200).json(creators);
  } catch (error) {
    logger.error("Error during getting creators by type", {
      error: error.message,
      type,
    });
    return res.status(500).json({
      message: "Internal server error during getting creators by type",
      error: error.message,
    });
  }
};

// Delete a creator (soft delete)
export const deleteCreator = async (req, res) => {
  const creatorId = req.params.id;

  try {
    // Find the creator by creatorId
    const creator = await Creator.findByPk(creatorId);

    if (!creator) {
      logger.warn("Creator deletion failed: Creator not found", { creatorId });
      return res.status(404).json({ message: "Creator not found" });
    }

    // Ensure authenticated user matches creatorId
    if (req.user.role !== "creator" || req.user.userId !== creatorId) {
      logger.warn("Creator deletion failed: Unauthorized", {
        creatorId,
        userId: req.user.userId,
      });
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this creator" });
    }

    // Soft delete the creator by setting status to false
    creator.status = false;
    await creator.save();

    logger.info("Creator deleted successfully", { creatorId });
    return res.status(200).json({ message: "Creator deleted successfully" });
  } catch (error) {
    logger.error("Error during creator deletion", {
      error: error.message,
      creatorId,
    });
    return res.status(500).json({
      message: "Internal server error during creator deletion",
      error: error.message,
    });
  }
};

// Export validation rules and controller functions
export {
  creatorCreateValidation,
  creatorUpdateValidation,
  creatorQueryValidation,
};

export default {
  createCreator,
  updateCreator,
  getCreatorById,
  getCreatorByUserId,
  getAllCreators,
  getCreatorsByCategory,
  getCreatorsByType,
  deleteCreator,
};
