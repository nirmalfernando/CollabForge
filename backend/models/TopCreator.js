import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

const TopCreator = sequelize.define(
  "TopCreator",
  {
    topCreatorId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Top Creator ID must be a valid UUID",
        },
      },
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: "Category ID must be a valid UUID",
        },
      },
      references: {
        model: "categories",
        key: "category_id",
      },
    },
    creatorId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: "Creator ID must be a valid UUID",
        },
      },
      references: {
        model: "creators",
        key: "creator_id",
      },
    },
    rankPosition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Rank position must be at least 1",
        },
      },
    },
    score: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Score must be non-negative",
        },
        max: {
          args: [1],
          msg: "Score must not exceed 1",
        },
      },
    },
    followerCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Follower count must be non-negative",
        },
      },
    },
    avgReviewScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: {
          args: [0],
          msg: "Average review score must be non-negative",
        },
        max: {
          args: [5],
          msg: "Average review score must not exceed 5",
        },
      },
    },
    collabCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Collaboration count must be non-negative",
        },
      },
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "top_creators",
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['category_id', 'creator_id'],
        name: 'unique_category_creator'
      },
      {
        fields: ['category_id', 'rank_position'],
        name: 'idx_category_rank'
      },
      {
        fields: ['last_updated'],
        name: 'idx_last_updated'
      }
    ]
  }
);

export default TopCreator;