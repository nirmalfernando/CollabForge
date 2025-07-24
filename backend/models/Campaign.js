import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Campaign model
const Campaign = sequelize.define(
  "Campaign",
  {
    campaignId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Campaign ID must be a valid UUID",
        },
      },
    },
    campaignTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Campaign title must be between 1 and 255 characters long",
        },
      },
    },
    budget: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: { args: 0, msg: "Budget must be a positive number" },
      },
    },
    campaignStatus: {
      type: DataTypes.ENUM("draft", "active", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "draft",
      validate: {
        isIn: {
          args: [["draft", "active", "completed", "cancelled"]],
          msg: "Campaign status must be one of 'draft', 'active', 'completed', or 'cancelled'",
        },
      },
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "categories",
        key: "category_id",
      },
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidRequirements(value) {
          if (
            value !== null &&
            value !== undefined &&
            typeof value !== "object"
          ) {
            throw new Error("Requirements must be a valid JSON object");
          }
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Description must be up to 500 characters long",
        },
      },
    },
    brandId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "brands",
        key: "brand_id",
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "campaigns",
    underscored: true,
  }
);

export default Campaign;
