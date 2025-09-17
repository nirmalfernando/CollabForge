import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Conversation model for chat rooms/conversations
const Conversation = sequelize.define(
  "Conversation",
  {
    conversationId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Conversation ID must be a valid UUID",
        },
      },
    },
    participant1Id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: "Participant 1 ID must be a valid UUID",
        },
      },
    },
    participant2Id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: "Participant 2 ID must be a valid UUID",
        },
      },
    },
    lastMessageId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUUID: {
          args: 4,
          msg: "Last Message ID must be a valid UUID",
        },
      },
    },
    lastMessageTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    participant1LastRead: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    participant2LastRead: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "conversations",
    underscored: true,
    indexes: [
      {
        fields: ["participant1_id"],
      },
      {
        fields: ["participant2_id"],
      },
      {
        unique: true,
        fields: ["participant1_id", "participant2_id"],
      },
      {
        fields: ["last_message_time"],
      },
    ],
  }
);

export default Conversation;
