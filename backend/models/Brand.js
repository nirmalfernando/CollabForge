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
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Brand ID must be a valid UUID",
        },
      },
      references: {
        model: "users", // Reference to the User model
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
        isJSON: {
          msg: "Description must be a valid JSON object",
        },
      },
      // isValid: function(value) {
      //   if (value && typeof value !== 'object') {
      //     throw new Error("Description must be a valid JSON object");
      //   }
      // }
    },
    whatWeLookFor: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isJSON: {
          msg: "What we look for must be a valid JSON object",
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
        isJSON: {
          msg: "Popular campaigns must be a valid JSON object",
        },
        // isValidCampaigns(value) {
        //   if (!Array.isArray(value)) {
        //     throw new Error("Popular campaigns must be an array of objects");
        //   }
        //   value.forEach((item) => {
        //     if (typeof item !== "object" || Array.isArray(item)) {
        //       throw new Error("Each campaign must be an object");
        //     }
        //   });
        // },
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
