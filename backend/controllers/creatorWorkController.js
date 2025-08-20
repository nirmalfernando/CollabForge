import CreatorWork from "../models/CreatorWork.js";
import Creator from "../models/Creator.js";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

// Validation rules for creating creator work
const creatorWorkValidation = [
  body("creatorId")
    .notEmpty()
    .withMessage("Creator ID is required")
    .isUUID(4)
    .withMessage("Creator ID must be a valid UUID"),
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters long"),
  body("content")
    .optional()
    .isLength({ max: 10000 })
    .withMessage("Content must be up to 10000 characters long"),
  body("contentType")
    .notEmpty()
    .withMessage("Content type is required")
    .isIn(["image", "text", "grid", "video", "embed"])
    .withMessage(
      "Content type must be one of 'image', 'text', 'grid', 'video', or 'embed'"
    ),
  body("thumbnailUrl")
    .optional()
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL"),
  body("mediaUrls")
    .optional()
    .isArray()
    .withMessage("Media URLs must be an array"),
  body("metrics")
    .optional()
    .isObject()
    .withMessage("Metrics must be a valid object"),
  body("publishedDate")
    .optional()
    .isISO8601()
    .withMessage("Published date must be a valid date"),
  body("collaborationBrand")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Collaboration brand must be up to 255 characters long"),
  body("campaignName")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Campaign name must be up to 255 characters long"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];

// Create a new creator work
export const createCreatorWork = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during creator work creation", {
      errors: errors.array(),
      workData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    creatorId,
    title,
    content,
    contentType,
    thumbnailUrl,
    mediaUrls,
    metrics,
    publishedDate,
    collaborationBrand,
    campaignName,
    tags,
    isVisible,
  } = req.body;

  try {
    // Check if creator exists
    const creator = await Creator.findByPk(creatorId);
    if (!creator) {
      logger.warn("Creator work creation failed: Creator not found", {
        creatorId,
      });
      return res.status(404).json({ message: "Creator not found" });
    }

    // Create new work
    const newWork = await CreatorWork.create({
      workId: uuidv4(),
      creatorId,
      title,
      content,
      contentType,
      thumbnailUrl,
      mediaUrls: mediaUrls || [],
      metrics: metrics || { views: 0, likes: 0, comments: 0, shares: 0 },
      publishedDate: publishedDate ? new Date(publishedDate) : null,
      collaborationBrand,
      campaignName,
      tags: tags || [],
      isVisible: isVisible !== undefined ? isVisible : true,
      status: true,
    });

    logger.info("Creator work created successfully", {
      workId: newWork.workId,
      creatorId,
      title,
    });

    return res.status(201).json({
      message: "Creator work created successfully",
      work: newWork,
    });
  } catch (error) {
    logger.error("Error during creator work creation", {
      error: error.message,
      workData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during work creation",
      error: error.message,
    });
  }
};

// Update creator work
export const updateCreatorWork = async (req, res) => {
  const workId = req.params.id;
  const updateData = req.body;

  try {
    const work = await CreatorWork.findByPk(workId);

    if (!work) {
      logger.warn("Creator work update failed: Work not found", { workId });
      return res.status(404).json({ message: "Creator work not found" });
    }

    // Update fields if provided
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && key !== "workId") {
        if (key === "publishedDate" && updateData[key]) {
          work[key] = new Date(updateData[key]);
        } else {
          work[key] = updateData[key];
        }
      }
    });

    await work.save();

    logger.info("Creator work updated successfully", { workId });
    return res.status(200).json({
      message: "Creator work updated successfully",
      work,
    });
  } catch (error) {
    logger.error("Error during creator work update", {
      error: error.message,
      workId,
      updateData,
    });
    return res.status(500).json({
      message: "Internal server error during work update",
      error: error.message,
    });
  }
};

// Get creator work by ID
export const getCreatorWorkById = async (req, res) => {
  const workId = req.params.id;

  try {
    const work = await CreatorWork.findOne({
      where: { workId, status: true },
      include: [
        {
          model: Creator,
          as: "creator",
          attributes: ["creatorId", "firstName", "lastName", "profilePicUrl"],
        },
      ],
    });

    if (!work) {
      logger.warn("Get creator work failed: Work not found or inactive", {
        workId,
      });
      return res
        .status(404)
        .json({ message: "Creator work not found or inactive" });
    }

    logger.info("Creator work retrieved successfully", { workId });
    return res.status(200).json(work);
  } catch (error) {
    logger.error("Error during getting creator work", {
      error: error.message,
      workId,
    });
    return res.status(500).json({
      message: "Internal server error during getting creator work",
      error: error.message,
    });
  }
};

// Get all works by creator ID
export const getWorksByCreatorId = async (req, res) => {
  const creatorId = req.params.creatorId;
  const { isVisible, contentType, page = 1, limit = 10 } = req.query;

  try {
    // Build where clause
    const whereClause = {
      creatorId,
      status: true,
    };

    if (isVisible !== undefined) {
      whereClause.isVisible = isVisible === "true";
    }

    if (contentType) {
      whereClause.contentType = contentType;
    }

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: works, count: totalCount } =
      await CreatorWork.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Creator,
            as: "creator",
            attributes: ["creatorId", "firstName", "lastName", "profilePicUrl"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: offset,
      });

    if (works.length === 0) {
      logger.info("No works found for creator", { creatorId });
      return res
        .status(404)
        .json({ message: "No works found for this creator" });
    }

    logger.info("Creator works retrieved successfully", {
      creatorId,
      count: works.length,
    });

    return res.status(200).json({
      works,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error("Error during getting creator works", {
      error: error.message,
      creatorId,
    });
    return res.status(500).json({
      message: "Internal server error during getting creator works",
      error: error.message,
    });
  }
};

// Get all creator works (with filters)
export const getAllCreatorWorks = async (req, res) => {
  const {
    contentType,
    isVisible,
    creatorId,
    collaborationBrand,
    page = 1,
    limit = 20,
    search,
  } = req.query;

  try {
    // Build where clause
    const whereClause = { status: true };

    if (contentType) {
      whereClause.contentType = contentType;
    }

    if (isVisible !== undefined) {
      whereClause.isVisible = isVisible === "true";
    }

    if (creatorId) {
      whereClause.creatorId = creatorId;
    }

    if (collaborationBrand) {
      whereClause.collaborationBrand = {
        [Op.iLike]: `%${collaborationBrand}%`,
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { collaborationBrand: { [Op.iLike]: `%${search}%` } },
        { campaignName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: works, count: totalCount } =
      await CreatorWork.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Creator,
            as: "creator",
            attributes: ["creatorId", "firstName", "lastName", "profilePicUrl"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: offset,
      });

    if (works.length === 0) {
      logger.info("No creator works found with given filters");
      return res.status(404).json({ message: "No creator works found" });
    }

    logger.info("All creator works retrieved successfully", {
      count: works.length,
      totalCount,
    });

    return res.status(200).json({
      works,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error("Error during getting all creator works", {
      error: error.message,
      query: req.query,
    });
    return res.status(500).json({
      message: "Internal server error during getting creator works",
      error: error.message,
    });
  }
};

// Toggle work visibility
export const toggleWorkVisibility = async (req, res) => {
  const workId = req.params.id;
  const { isVisible } = req.body;

  try {
    const work = await CreatorWork.findByPk(workId);

    if (!work) {
      logger.warn("Toggle visibility failed: Work not found", { workId });
      return res.status(404).json({ message: "Creator work not found" });
    }

    work.isVisible = isVisible !== undefined ? isVisible : !work.isVisible;
    await work.save();

    logger.info("Work visibility toggled successfully", {
      workId,
      isVisible: work.isVisible,
    });

    return res.status(200).json({
      message: "Work visibility updated successfully",
      work,
    });
  } catch (error) {
    logger.error("Error during toggling work visibility", {
      error: error.message,
      workId,
    });
    return res.status(500).json({
      message: "Internal server error during visibility update",
      error: error.message,
    });
  }
};

// Delete creator work (soft delete)
export const deleteCreatorWork = async (req, res) => {
  const workId = req.params.id;

  try {
    const work = await CreatorWork.findByPk(workId);

    if (!work) {
      logger.warn("Work deletion failed: Work not found", { workId });
      return res.status(404).json({ message: "Creator work not found" });
    }

    // Soft delete by setting status to false
    work.status = false;
    await work.save();

    logger.info("Creator work deleted successfully", { workId });
    return res
      .status(200)
      .json({ message: "Creator work deleted successfully" });
  } catch (error) {
    logger.error("Error during creator work deletion", {
      error: error.message,
      workId,
    });
    return res.status(500).json({
      message: "Internal server error during work deletion",
      error: error.message,
    });
  }
};

// Export validation rules for use in routes
export { creatorWorkValidation };

export default {
  createCreatorWork,
  updateCreatorWork,
  getCreatorWorkById,
  getWorksByCreatorId,
  getAllCreatorWorks,
  toggleWorkVisibility,
  deleteCreatorWork,
};
