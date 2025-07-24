import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Brand model
const Brand = sequelize.define(
  "Brand",
  {
    brandId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        isUUID: {
          args: 4,
          msg: "Brand ID must be a valid UUID",
        },
      },
      references: {
        model: "users",
        key: "user_id",
      },
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: "Company name must be between 1 and 100 characters long",
        },
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Bio must be up to 500 characters long",
        },
      },
    },
    description: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidDescription(value) {
          if (
            value !== null &&
            value !== undefined &&
            typeof value !== "object"
          ) {
            throw new Error("Description must be a valid JSON object");
          }
        },
      },
    },
    whatWeLookFor: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidWhatWeLookFor(value) {
          if (
            value !== null &&
            value !== undefined &&
            typeof value !== "object"
          ) {
            throw new Error("What we look for must be a valid JSON object");
          }
        },
      },
    },
    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Profile picture URL must be a valid URL",
        },
      },
    },
    backgroundImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Background image URL must be a valid URL",
        },
      },
    },
    popularCampaigns: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isValidCampaigns(value) {
          if (value !== null && value !== undefined && !Array.isArray(value)) {
            throw new Error("Popular campaigns must be an array of objects");
          }
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (
                typeof item !== "object" ||
                Array.isArray(item) ||
                !item.campaignId
              ) {
                throw new Error(
                  "Each campaign must be an object with a campaignId"
                );
              }
            });
          }
        },
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isBoolean: {
          msg: "Status must be a boolean value",
        },
      },
    },
  },
  {
    tableName: "brands",
    timestamps: true,
    underscored: true,
  }
);

export default Brand;
