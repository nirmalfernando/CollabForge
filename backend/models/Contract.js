import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Contract model
const Contract = sequelize.define(
  "Contract",
  {
    contractId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Contract ID must be a valid UUID",
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
    proposalId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "proposals", // Reference to the Proposal model
        key: "proposal_id",
      },
    },
    brandId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "brands", // Reference to the Brand model
        key: "brand_id",
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
    contractTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Contract title must be between 1 and 255 characters long",
        },
      },
    },
    contractDetails: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 1000],
          msg: "Contract details must be between 1 and 1000 characters long",
        },
      },
    },
    contractSuggestions: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isJSON: {
          msg: "Contract suggestions must be a valid JSON object",
        },
      },
    },
    creatorSignature: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: "Creator signature must be up to 100 characters long",
        },
      },
    },
    signedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Signed date must be a valid date",
        },
        notEmpty: {
          msg: "Signed date cannot be empty",
        },
      },
    },
    contractStatus: {
      type: DataTypes.ENUM("Pending", "Active", "Awaiting Payment", "Completed", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
      validate: {
        isIn: {
          args: [["Pending", "Active", "Awaiting Payment", "Completed", "Cancelled"]],
          msg: "Contract status must be one of 'Pending', 'Active', 'Awaiting Payment', 'Completed', or 'Cancelled'",
        },
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
    tableName: "contracts",
    underscored: true,
  }
);

export default Contract;
