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
        isUUID: {
          args: 4,
          msg: "Review ID must be a valid UUID",
        },
      },
    },
    campaignId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "campaigns", // Reference to the Campaign model
        key: "campaign_id",
      },
    },
    creatorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "creators", // Reference to the Creator model
        key: "creator_id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        msg: "Rating must be between 1 and 5",
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Comment must be up to 1000 characters long",
        },
      },
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
    underscored: true,
  }
);

export default Review;
