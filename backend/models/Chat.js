import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Chat model for individual messages
const Chat = sequelize.define(
  "Chat",
  {
    chatId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Chat ID must be a valid UUID",
        },
      },
    },
    conversationId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: "Conversation ID must be a valid UUID",
        },
      },
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: "Sender ID must be a valid UUID",
        },
      },
    },
    receiverId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: "Receiver ID must be a valid UUID",
        },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 2000],
          msg: "Message must be between 1 and 2000 characters long",
        },
      },
    },
    messageType: {
      type: DataTypes.ENUM("text", "image", "file", "audio", "video"),
      allowNull: false,
      defaultValue: "text",
      validate: {
        isIn: {
          args: [["text", "image", "file", "audio", "video"]],
          msg: "Message type must be one of: text, image, file, audio, video",
        },
      },
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isDelivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    editedAt: {
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
    tableName: "chats",
    underscored: true,
    indexes: [
      {
        fields: ["conversation_id"],
      },
      {
        fields: ["sender_id"],
      },
      {
        fields: ["receiver_id"],
      },
      {
        fields: ["created_at"],
      },
    ],
  }
);

export default Chat;
