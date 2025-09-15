import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Review model
const Review = sequelize.define(
  "Review",
  {
    reviewId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: 4,
      },
    },
    campaignId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUUID: 4,
        customCampaignId(value) {
          if (!value) {
            throw new Error("Campaign ID is required");
          }
        },
      },
      references: {
        model: "campaigns",
        key: "campaign_id",
      },
    },
    creatorId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUUID: 4,
        customCreatorId(value) {
          if (!value) {
            throw new Error("Creator ID is required");
          }
        },
      },
      references: {
        model: "creators",
        key: "creator_id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        customRating(value) {
          if (value < 1 || value > 5) {
            throw new Error("Rating must be between 1 and 5");
          }
        },
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        customComment(value) {
          if (value && value.length > 1000) {
            throw new Error("Comment must be up to 1000 characters long");
          }
        },
      },
    },
    isShown: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    tableName: "creator_reviews",
    timestamps: true,
    underscored: true,
  }
);

export default Review;
