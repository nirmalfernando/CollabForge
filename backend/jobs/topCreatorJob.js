import Creator from "../models/Creator.js";
import Category from "../models/Category.js";
import Review from "../models/Review.js";
import Contract from "../models/Contract.js";
import TopCreator from "../models/TopCreator.js";
import User from "../models/User.js";
import { Op, fn, col, literal } from "sequelize";
import sequelize from "../connect.js";
import logger from "../middlewares/logger.js";

class TopCreatorJob {
  // Main job function to calculate and store top creators
  static async calculateTopCreators(limit = 5) {
    try {
      logger.info("Starting top creators calculation job");
      
      // Get all active categories (no transaction needed here)
      const categories = await Category.findAll({
        where: { status: true }
      });

      if (categories.length === 0) {
        logger.warn("No active categories found for top creators calculation");
        return { success: true, message: "No active categories found" };
      }

      let totalProcessed = 0;
      let totalErrors = 0;

      // Process each category
      for (const category of categories) {
        try {
          await this.processCategory(category.categoryId, limit);  
          totalProcessed++;
        } catch (error) {
          logger.error(`Error processing category ${category.categoryId}`, {
            error: error.message,
            categoryId: category.categoryId
          });
          totalErrors++;
        }
      }
      
      logger.info("Top creators calculation job completed", {
        totalProcessed,
        totalErrors,
        categoriesCount: categories.length
      });

      return { 
        success: true, 
        message: "Top creators calculated successfully",
        stats: { totalProcessed, totalErrors, categoriesCount: categories.length }
      };

    } catch (error) {
      logger.error("Top creators calculation job failed", {
        error: error.message
      });
      throw error;
    }
  }

  // Process a single category
  static async processCategory(categoryId, limit) {
    const transaction = await sequelize.transaction();  
    try {
      logger.info(`Processing category: ${categoryId}`);

      // Clear existing data for this category
      await TopCreator.destroy({
        where: { categoryId },
        transaction
      });

      // Get creator stats for this category
      const creatorStats = await this.getCreatorStatsForCategory(categoryId, transaction);

      if (creatorStats.length === 0) {
        logger.warn(`No creators found for category ${categoryId}`);
        await transaction.commit();
        return;
      }

      // Calculate scores and rank creators
      const rankedCreators = this.calculateScoresAndRank(creatorStats, limit);

      // Insert top creators data
      const topCreatorsData = rankedCreators.map((creator, index) => ({
        categoryId,
        creatorId: creator.creatorId,
        rankPosition: index + 1,
        score: creator.score,
        followerCount: creator.followerCount || 0,
        avgReviewScore: creator.avgReviewScore || 0,
        collabCount: creator.collabCount || 0,
        lastUpdated: new Date()
      }));

      await TopCreator.bulkCreate(topCreatorsData, { transaction });
      
      logger.info(`Successfully processed ${rankedCreators.length} top creators for category ${categoryId}`);
      await transaction.commit();  
    } catch (error) {
      await transaction.rollback();  
      logger.error(`Failed to process category ${categoryId}`, { error: error.message });
      throw error;  
    }
  }

  // Get creator statistics for a specific category
  static async getCreatorStatsForCategory(categoryId, transaction) {
    return await Creator.findAll({
      where: { 
        categoryId, 
        status: true 
      },
      include: [
        {
          model: User,
          attributes: ['userId', 'username'],  
          where: { status: true },
          required: true
        },
        {
          model: Review,
          attributes: [],
          required: false
        },
        {
          model: Contract,
          attributes: [],
          where: { contract_status: 'Completed' }, 
          required: false
        }
      ],
      attributes: [
        'creatorId', 
        'firstName',
        'lastName',
        'profilePicUrl',
        'bio',
        // Extracts first platform's followers as numeric, defaults to 0
        [
          literal(`COALESCE((social_media -> 0 ->> 'followers')::numeric, 0)`),
          'followerCount'
        ],
        // Calculate average review score
        [
          fn('COALESCE', fn('AVG', col('Reviews.rating')), 0),
          'avgReviewScore'
        ],
        // Count completed collaborations
        [
          fn('COUNT', fn('DISTINCT', col('Contracts.contract_id'))),
          'collabCount'
        ]
      ],
      group: ['Creator.creator_id', 'User.user_id'],  
      transaction
    });
  }

  // Calculate scores and rank creators 
  static calculateScoresAndRank(creatorStats, limit) {
    // Find max values for normalization
    const maxFollowers = Math.max(...creatorStats.map(c => c.dataValues?.followerCount || 0));
    const maxCollabs = Math.max(...creatorStats.map(c => c.dataValues?.collabCount || 0));

    // Calculate scores for each creator
    const scoredCreators = creatorStats.map(creator => {
      const data = creator.dataValues || creator;
      
      const followerCount = data.followerCount || 0;
      const avgReviewScore = data.avgReviewScore || 0;
      const collabCount = data.collabCount || 0;

      // Normalize values (0-1)
      const normalizedFollowers = maxFollowers > 0 ? followerCount / maxFollowers : 0;
      const normalizedReviews = avgReviewScore / 5; // Reviews are 1-5 scale
      const normalizedCollabs = maxCollabs > 0 ? collabCount / maxCollabs : 0;

      // Weighted score calculation
      const score = (
        (0.5 * normalizedFollowers) +
        (0.3 * normalizedReviews) +
        (0.2 * normalizedCollabs)
      );

      return {
        ...data,
        creatorId: data.creatorId,
        followerCount,
        avgReviewScore,
        collabCount,
        score: parseFloat(score.toFixed(4))
      };
    });

    // Sort by score descending and take top N
    return scoredCreators
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Get follower count from social media JSON
  static extractFollowerCount(socialMedia) {
    if (!socialMedia || !Array.isArray(socialMedia)) {
      return 0;
    }

    // Sum followers from all social media platforms
    return socialMedia.reduce((total, platform) => {
      return total + (platform.followers || 0);
    }, 0);
  }

  // Utility method to get last update time
  static async getLastUpdateTime() {
    try {
      const result = await TopCreator.findOne({
        attributes: [[fn('MAX', col('last_updated')), 'lastUpdated']],
      });
      
      return result?.dataValues?.lastUpdated || null;
    } catch (error) {
      logger.error("Error getting last update time", { error: error.message });
      return null;
    }
  }

  // Check if update is needed
  static async shouldUpdate(intervalHours = 24) {
    const lastUpdate = await this.getLastUpdateTime();
    
    if (!lastUpdate) {
      return true; // First run
    }

    const hoursElapsed = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60);
    return hoursElapsed >= intervalHours;
  }
}

export default TopCreatorJob;