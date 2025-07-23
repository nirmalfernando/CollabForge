import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Proposal model
const Proposal = sequelize.define(
  "Proposal",
  {
    proposalId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Proposal ID must be a valid UUID",
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
    proposalTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Proposal title must be between 1 and 255 characters long",
        },
      },
    },
    proposalPitch: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 1000],
          msg: "Proposal pitch must be between 1 and 1000 characters long",
        },
      },
    },
    contentPlan: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isJSON: {
          msg: "Content plan must be a valid JSON object",
        },
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Start date must be a valid date",
        },
        notEmpty: {
          msg: "Start date cannot be empty",
        },
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "End date must be a valid date",
        },
        notEmpty: {
          msg: "End date cannot be empty",
        },
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
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "proposals",
  }
);

export default Proposal;
