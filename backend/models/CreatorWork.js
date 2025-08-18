import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the CreatorWork model
const CreatorWork = sequelize.define(
  "CreatorWork",
  {
    workId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Work ID must be a valid UUID",
        },
      },
    },
    creatorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "creators",
        key: "creator_id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Title must be between 1 and 255 characters long",
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 10000],
          msg: "Content must be up to 10000 characters long",
        },
      },
    },
    contentType: {
      type: DataTypes.ENUM("image", "text", "grid", "video", "embed"),
      allowNull: false,
      defaultValue: "text",
      validate: {
        isIn: {
          args: [["image", "text", "grid", "video", "embed"]],
          msg: "Content type must be one of 'image', 'text', 'grid', 'video', or 'embed'",
        },
      },
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Thumbnail URL must be a valid URL",
        },
      },
    },
    mediaUrls: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isValidMediaUrls(value) {
          if (value !== null && value !== undefined && !Array.isArray(value)) {
            throw new Error("Media URLs must be an array");
          }
          if (Array.isArray(value)) {
            value.forEach((url) => {
              if (typeof url !== "string") {
                throw new Error("Each media URL must be a string");
              }
            });
          }
        },
      },
    },
    metrics: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      },
      validate: {
        isValidMetrics(value) {
          if (
            value !== null &&
            value !== undefined &&
            typeof value !== "object"
          ) {
            throw new Error("Metrics must be a valid JSON object");
          }
        },
      },
    },
    publishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Published date must be a valid date",
        },
      },
    },
    collaborationBrand: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "Collaboration brand must be up to 255 characters long",
        },
      },
    },
    campaignName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "Campaign name must be up to 255 characters long",
        },
      },
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isValidTags(value) {
          if (value !== null && value !== undefined && !Array.isArray(value)) {
            throw new Error("Tags must be an array");
          }
          if (Array.isArray(value)) {
            value.forEach((tag) => {
              if (typeof tag !== "string") {
                throw new Error("Each tag must be a string");
              }
            });
          }
        },
      },
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "creator_works",
    underscored: true,
  }
);

export default CreatorWork;
