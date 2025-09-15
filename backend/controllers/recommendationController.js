import TopCreator from "../models/TopCreator.js";
import Creator from "../models/Creator.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import TopCreatorJob from "../jobs/topCreatorJob.js";
import { param, query, validationResult } from "express-validator";
import logger from "../middlewares/logger.js";

// Validation rules for getting top creators by category
export const getTopCreatorsByCategoryValidation = [
  param("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isUUID(4)
    .withMessage("Category ID must be a valid UUID"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Limit must be between 1 and 20")
];

// Validation rules for getting all top creators
export const getAllTopCreatorsValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Limit must be between 1 and 20")
];

// Validation rules for brand-specific recommendations
export const getBrandRecommendationsValidation = [
  param("brandId")
    .notEmpty()
    .withMessage("Brand ID is required")
    .isUUID(4)
    .withMessage("Brand ID must be a valid UUID"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("includeAllCategories")
    .optional()
    .isBoolean()
    .withMessage("includeAllCategories must be a boolean"),
  query("minScore")
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage("minScore must be between 0 and 1"),
  query("categoryId")
    .optional()
    .isUUID(4)
    .withMessage("categoryId must be a valid UUID")
];

// Get top creators for a specific category
export const getTopCreatorsByCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get top creators by category", {
      errors: errors.array(),
      categoryId: req.params.categoryId,
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryId } = req.params;
  const limit = parseInt(req.query.limit) || 5;

  try {
    // Check if category exists and is active
    const category = await Category.findOne({
      where: { categoryId, status: true }
    });

    if (!category) {
      logger.warn("Get top creators failed: Category not found or inactive", {
        categoryId,
      });
      return res.status(404).json({ 
        message: "Category not found or inactive" 
      });
    }

    // Get top creators for the category
    const topCreators = await TopCreator.findAll({
      where: { categoryId },
      include: [
        {
          model: Creator,
          include: [
            {
              model: User,
              attributes: ['userId', 'username'],
              where: { status: true }
            }
          ],
          where: { status: true }
        },
        {
          model: Category,
          attributes: ['categoryId', 'categoryName']
        }
      ],
      order: [['rankPosition', 'ASC']],
      limit: limit
    });

    if (topCreators.length === 0) {
      logger.info("No top creators found for category", { categoryId });
      
      // Check if we need to run the job
      const shouldUpdate = await TopCreatorJob.shouldUpdate(1); // Check if update needed within 1 hour
      
      return res.status(404).json({ 
        message: "No top creators found for this category",
        suggestion: shouldUpdate ? "Top creators data may need to be updated" : null
      });
    }

    const responseData = topCreators.map(topCreator => ({
      rank: topCreator.rankPosition,
      score: topCreator.score,
      creator: {
        creatorId: topCreator.Creator.creatorId,
        firstName: topCreator.Creator.firstName,
        lastName: topCreator.Creator.lastName,
        nickName: topCreator.Creator.nickName,
        bio: topCreator.Creator.bio,
        profilePicUrl: topCreator.Creator.profilePicUrl,
        type: topCreator.Creator.type,
        username: topCreator.Creator.User.username,
      },
      metrics: {
        followerCount: topCreator.followerCount,
        avgReviewScore: parseFloat(topCreator.avgReviewScore),
        collabCount: topCreator.collabCount,
      },
      category: {
        categoryId: topCreator.Category.categoryId,
        categoryName: topCreator.Category.categoryName,
      },
      lastUpdated: topCreator.lastUpdated
    }));

    logger.info("Top creators retrieved successfully for category", {
      categoryId,
      count: responseData.length
    });

    return res.status(200).json({
      message: "Top creators retrieved successfully",
      category: {
        categoryId: category.categoryId,
        categoryName: category.categoryName
      },
      topCreators: responseData,
      meta: {
        count: responseData.length,
        limit: limit,
        lastUpdated: topCreators[0]?.lastUpdated
      }
    });

  } catch (error) {
    logger.error("Error during getting top creators by category", {
      error: error.message,
      categoryId,
    });
    return res.status(500).json({
      message: "Internal server error during getting top creators by category",
      error: error.message,
    });
  }
};

// Get all top creators across categories
export const getAllTopCreators = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get all top creators", {
      errors: errors.array(),
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const limit = parseInt(req.query.limit) || 5;

  try {
    const topCreators = await TopCreator.findAll({
      where: {
        rankPosition: {
          [Op.lte]: limit
        }
      },
      include: [
        {
          model: Creator,
          include: [
            {
              model: User,
              attributes: ['userId', 'username'],
              where: { status: true }
            }
          ],
          where: { status: true }
        },
        {
          model: Category,
          attributes: ['categoryId', 'categoryName'],
          where: { status: true }
        }
      ],
      order: [['Category', 'categoryName', 'ASC'], ['rankPosition', 'ASC']]
    });

    if (topCreators.length === 0) {
      logger.info("No top creators found");
      
      // Check if we need to run the job
      const shouldUpdate = await TopCreatorJob.shouldUpdate(1);
      
      return res.status(404).json({ 
        message: "No top creators found",
        suggestion: shouldUpdate ? "Top creators data may need to be updated" : null
      });
    }

    // Group by category
    const groupedByCategory = topCreators.reduce((acc, topCreator) => {
      const categoryId = topCreator.Category.categoryId;
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: {
            categoryId: topCreator.Category.categoryId,
            categoryName: topCreator.Category.categoryName,
          },
          creators: []
        };
      }

      acc[categoryId].creators.push({
        rank: topCreator.rankPosition,
        score: topCreator.score,
        creator: {
          creatorId: topCreator.Creator.creatorId,
          firstName: topCreator.Creator.firstName,
          lastName: topCreator.Creator.lastName,
          nickName: topCreator.Creator.nickName,
          bio: topCreator.Creator.bio,
          profilePicUrl: topCreator.Creator.profilePicUrl,
          type: topCreator.Creator.type,
          username: topCreator.Creator.User.username,
        },
        metrics: {
          followerCount: topCreator.followerCount,
          avgReviewScore: parseFloat(topCreator.avgReviewScore),
          collabCount: topCreator.collabCount,
        },
        lastUpdated: topCreator.lastUpdated
      });

      return acc;
    }, {});

    const responseData = Object.values(groupedByCategory);

    logger.info("All top creators retrieved successfully", {
      categoriesCount: responseData.length,
      totalCreators: topCreators.length
    });

    return res.status(200).json({
      message: "All top creators retrieved successfully",
      data: responseData,
      meta: {
        categoriesCount: responseData.length,
        totalCreators: topCreators.length,
        limit: limit,
        lastUpdated: topCreators[0]?.lastUpdated
      }
    });

  } catch (error) {
    logger.error("Error during getting all top creators", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error during getting all top creators",
      error: error.message,
    });
  }
};

// Get brand-specific creator recommendations
export const getBrandRecommendations = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during get brand recommendations", {
      errors: errors.array(),
      brandId: req.params.brandId,
      query: req.query,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { brandId } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  const includeAllCategories = req.query.includeAllCategories === 'true';
  const minScore = parseFloat(req.query.minScore) || 0;
  const specificCategoryId = req.query.categoryId;

  try {
    // Step 1: Get brand's campaign categories
    let brandCategoryIds;
    
    if (specificCategoryId) {
      // If specific category is requested, use only that
      brandCategoryIds = [specificCategoryId];
    } else if (includeAllCategories) {
      // Get all active categories
      const allCategories = await Category.findAll({
        where: { status: true },
        attributes: ['categoryId']
      });
      brandCategoryIds = allCategories.map(cat => cat.categoryId);
    } else {
      // Get brand's campaign categories (default behavior)
      const brandCampaigns = await Campaign.findAll({
        where: { 
          brandId,
          status: true // Only active campaigns
        },
        attributes: ['categoryId'],
        group: ['categoryId'],
        include: [
          {
            model: Category,
            attributes: ['categoryId', 'categoryName'],
            where: { status: true }
          }
        ]
      });

      if (brandCampaigns.length === 0) {
        logger.info("No active campaigns found for brand", { brandId });
        return res.status(404).json({ 
          message: "No active campaigns found for this brand. Cannot generate recommendations.",
          suggestion: "Create campaigns in specific categories to get targeted recommendations, or use includeAllCategories=true for general recommendations."
        });
      }

      brandCategoryIds = brandCampaigns.map(campaign => campaign.categoryId);
    }

    logger.info("Brand categories for recommendations", {
      brandId,
      categoryIds: brandCategoryIds,
      includeAllCategories,
      specificCategory: specificCategoryId
    });

    // Step 2: Get top creators from those categories
    const whereConditions = {
      categoryId: {
        [Op.in]: brandCategoryIds
      }
    };

    // Add minimum score filter if provided
    if (minScore > 0) {
      whereConditions.score = {
        [Op.gte]: minScore
      };
    }

    const recommendedCreators = await TopCreator.findAll({
      where: whereConditions,
      include: [
        {
          model: Creator,
          include: [
            {
              model: User,
              attributes: ['userId', 'username'],
              where: { status: true }
            }
          ],
          where: { status: true }
        },
        {
          model: Category,
          attributes: ['categoryId', 'categoryName'],
          where: { status: true }
        }
      ],
      order: [
        ['score', 'DESC'],
        ['rankPosition', 'ASC']
      ],
      limit: limit
    });

    if (recommendedCreators.length === 0) {
      logger.info("No recommended creators found for brand", { 
        brandId, 
        categoryIds: brandCategoryIds,
        minScore 
      });
      
      return res.status(404).json({ 
        message: "No top creators found matching your brand's campaign categories and criteria.",
        suggestion: "Try lowering the minimum score requirement or expanding to all categories."
      });
    }

    // Step 3: Format response data
    const responseData = recommendedCreators.map(topCreator => ({
      rank: topCreator.rankPosition,
      score: parseFloat(topCreator.score),
      creator: {
        creatorId: topCreator.Creator.creatorId,
        firstName: topCreator.Creator.firstName,
        lastName: topCreator.Creator.lastName,
        nickName: topCreator.Creator.nickName,
        bio: topCreator.Creator.bio,
        profilePicUrl: topCreator.Creator.profilePicUrl,
        type: topCreator.Creator.type,
        username: topCreator.Creator.User.username,
      },
      metrics: {
        followerCount: topCreator.followerCount,
        avgReviewScore: parseFloat(topCreator.avgReviewScore),
        collabCount: topCreator.collabCount,
      },
      category: {
        categoryId: topCreator.Category.categoryId,
        categoryName: topCreator.Category.categoryName,
      },
      lastUpdated: topCreator.lastUpdated,
      recommendationReason: `Top performer in ${topCreator.Category.categoryName} category`
    }));

    // Step 4: Group by category for better presentation
    const groupedByCategory = responseData.reduce((acc, creator) => {
      const categoryId = creator.category.categoryId;
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: creator.category,
          creators: [],
          avgScore: 0,
          totalCreators: 0
        };
      }

      acc[categoryId].creators.push(creator);
      acc[categoryId].totalCreators++;
      acc[categoryId].avgScore += creator.score;
      
      return acc;
    }, {});

    // Calculate average scores per category
    Object.keys(groupedByCategory).forEach(categoryId => {
      groupedByCategory[categoryId].avgScore = 
        (groupedByCategory[categoryId].avgScore / groupedByCategory[categoryId].totalCreators).toFixed(4);
    });

    const categorizedData = Object.values(groupedByCategory);

    logger.info("Brand recommendations retrieved successfully", {
      brandId,
      categoriesMatched: brandCategoryIds.length,
      creatorsFound: responseData.length,
      categoriesWithCreators: categorizedData.length
    });

    return res.status(200).json({
      message: "Brand-specific creator recommendations retrieved successfully",
      brandId: brandId,
      recommendations: {
        creators: responseData,
        byCategory: categorizedData
      },
      meta: {
        totalRecommendations: responseData.length,
        categoriesMatched: brandCategoryIds.length,
        categoriesWithCreators: categorizedData.length,
        filters: {
          minScore: minScore,
          includeAllCategories: includeAllCategories,
          specificCategory: specificCategoryId || null
        },
        limit: limit,
        lastUpdated: recommendedCreators[0]?.lastUpdated
      }
    });

  } catch (error) {
    logger.error("Error during getting brand recommendations", {
      error: error.message,
      brandId,
      stack: error.stack
    });
    return res.status(500).json({
      message: "Internal server error during getting brand recommendations",
      error: error.message,
    });
  }
};

// Manually trigger top creators calculation (admin only)
export const triggerTopCreatorsCalculation = async (req, res) => {
  try {
    // Check if user has admin role
    if (req.user.role !== "admin") {
      logger.warn("Unauthorized attempt to trigger top creators calculation", {
        userId: req.user.userId,
        role: req.user.role
      });
      return res.status(403).json({ 
        message: "Unauthorized. Admin access required." 
      });
    }

    logger.info("Manual top creators calculation triggered", {
      triggeredBy: req.user.userId
    });

    // Run the job
    const result = await TopCreatorJob.calculateTopCreators();

    return res.status(200).json({
      message: "Top creators calculation completed successfully",
      result
    });

  } catch (error) {
    logger.error("Error during manual top creators calculation", {
      error: error.message,
      triggeredBy: req.user.userId
    });
    return res.status(500).json({
      message: "Internal server error during top creators calculation",
      error: error.message,
    });
  }
};

// Get job status and last update info
export const getTopCreatorsJobStatus = async (req, res) => {
  try {
    const lastUpdate = await TopCreatorJob.getLastUpdateTime();
    const shouldUpdate = await TopCreatorJob.shouldUpdate();

    // Get total count of top creators
    const totalTopCreators = await TopCreator.count();

    // Get count by categories
    const categoriesCount = await TopCreator.count({
      distinct: true,
      col: 'categoryId'
    });

    return res.status(200).json({
      message: "Top creators job status retrieved successfully",
      status: {
        lastUpdate,
        shouldUpdate,
        nextUpdateDue: shouldUpdate ? "Now" : "Within 24 hours",
        totalTopCreators,
        categoriesCount,
        isHealthy: totalTopCreators > 0
      }
    });

  } catch (error) {
    logger.error("Error getting top creators job status", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Internal server error getting job status",
      error: error.message,
    });
  }
};

export default {
  getTopCreatorsByCategory,
  getAllTopCreators,
  triggerTopCreatorsCalculation,
  getTopCreatorsJobStatus
};