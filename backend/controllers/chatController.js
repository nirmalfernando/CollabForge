import Chat from "../models/Chat.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";
import { body, validationResult } from "express-validator";

// Validation rules for sending a message
const sendMessageValidation = [
  body("receiverId")
    .notEmpty()
    .withMessage("Receiver ID is required")
    .isUUID(4)
    .withMessage("Receiver ID must be a valid UUID"),
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be between 1 and 2000 characters long"),
  body("messageType")
    .optional()
    .isIn(["text", "image", "file", "audio", "video"])
    .withMessage(
      "Message type must be one of: text, image, file, audio, video"
    ),
];

// Send a message
export const sendMessage = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error("Validation errors during message sending", {
      errors: errors.array(),
      userData: req.body,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { receiverId, message, messageType = "text" } = req.body;
  const senderId = req.user.userId;

  try {
    // Check if receiver exists
    const receiver = await User.findOne({
      where: { userId: receiverId, status: true },
    });

    if (!receiver) {
      logger.warn("Message sending failed: Receiver not found", { receiverId });
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          {
            participant1Id: senderId,
            participant2Id: receiverId,
          },
          {
            participant1Id: receiverId,
            participant2Id: senderId,
          },
        ],
        status: true,
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        conversationId: uuidv4(),
        participant1Id: senderId,
        participant2Id: receiverId,
        isActive: true,
        status: true,
      });
    }

    // Create the message
    const newMessage = await Chat.create({
      chatId: uuidv4(),
      conversationId: conversation.conversationId,
      senderId,
      receiverId,
      message,
      messageType,
      isDelivered: true,
      status: true,
    });

    // Update conversation's last message info
    await conversation.update({
      lastMessageId: newMessage.chatId,
      lastMessageTime: newMessage.createdAt,
    });

    // Include sender info in the response
    const messageWithSender = await Chat.findByPk(newMessage.chatId, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["userId", "name", "username"],
        },
      ],
    });

    logger.info("Message sent successfully", {
      chatId: newMessage.chatId,
      senderId,
      receiverId,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: messageWithSender,
    });
  } catch (error) {
    logger.error("Error during message sending", {
      error: error.message,
      userData: req.body,
    });
    return res.status(500).json({
      message: "Internal server error during message sending",
      error: error.message,
    });
  }
};

// Get conversation messages
export const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user.userId;

  try {
    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      where: {
        conversationId,
        [Op.or]: [{ participant1Id: userId }, { participant2Id: userId }],
        status: true,
      },
    });

    if (!conversation) {
      logger.warn("Conversation not found or user not authorized", {
        conversationId,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Conversation not found or access denied" });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Chat.findAndCountAll({
      where: {
        conversationId,
        status: true,
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["userId", "name", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    logger.info("Conversation messages retrieved successfully", {
      conversationId,
      userId,
      messageCount: messages.count,
    });

    return res.status(200).json({
      messages: messages.rows.reverse(), // Reverse to show oldest first
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(messages.count / parseInt(limit)),
        totalMessages: messages.count,
        hasNext: offset + parseInt(limit) < messages.count,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    logger.error("Error during getting conversation messages", {
      error: error.message,
      conversationId,
      userId,
    });
    return res.status(500).json({
      message: "Internal server error during getting messages",
      error: error.message,
    });
  }
};

// Get user conversations
export const getUserConversations = async (req, res) => {
  const userId = req.user.userId;
  const { page = 1, limit = 20 } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const conversations = await Conversation.findAndCountAll({
      where: {
        [Op.or]: [{ participant1Id: userId }, { participant2Id: userId }],
        status: true,
      },
      include: [
        {
          model: User,
          as: "participant1",
          attributes: ["userId", "name", "username"],
        },
        {
          model: User,
          as: "participant2",
          attributes: ["userId", "name", "username"],
        },
        {
          model: Chat,
          as: "lastMessage",
          attributes: ["chatId", "message", "messageType", "createdAt"],
          required: false,
        },
      ],
      order: [["lastMessageTime", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    // Format conversations to show the other participant
    const formattedConversations = conversations.rows.map((conv) => {
      const otherParticipant =
        conv.participant1Id === userId ? conv.participant2 : conv.participant1;

      return {
        conversationId: conv.conversationId,
        otherParticipant,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        unreadCount: 0, // You can calculate this based on lastRead timestamps
        isActive: conv.isActive,
      };
    });

    logger.info("User conversations retrieved successfully", {
      userId,
      conversationCount: conversations.count,
    });

    return res.status(200).json({
      conversations: formattedConversations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(conversations.count / parseInt(limit)),
        totalConversations: conversations.count,
        hasNext: offset + parseInt(limit) < conversations.count,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    logger.error("Error during getting user conversations", {
      error: error.message,
      userId,
    });
    return res.status(500).json({
      message: "Internal server error during getting conversations",
      error: error.message,
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.userId;

  try {
    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      where: {
        conversationId,
        [Op.or]: [{ participant1Id: userId }, { participant2Id: userId }],
        status: true,
      },
    });

    if (!conversation) {
      logger.warn("Conversation not found or user not authorized", {
        conversationId,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Conversation not found or access denied" });
    }

    // Mark all unread messages in this conversation as read
    await Chat.update(
      { isRead: true },
      {
        where: {
          conversationId,
          receiverId: userId,
          isRead: false,
          status: true,
        },
      }
    );

    // Update user's last read timestamp in conversation
    const updateField =
      conversation.participant1Id === userId
        ? "participant1LastRead"
        : "participant2LastRead";

    await conversation.update({
      [updateField]: new Date(),
    });

    logger.info("Messages marked as read successfully", {
      conversationId,
      userId,
    });

    return res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    logger.error("Error during marking messages as read", {
      error: error.message,
      conversationId,
      userId,
    });
    return res.status(500).json({
      message: "Internal server error during marking messages as read",
      error: error.message,
    });
  }
};

// Delete a message (soft delete)
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.userId;

  try {
    const message = await Chat.findOne({
      where: {
        chatId: messageId,
        senderId: userId,
        status: true,
      },
    });

    if (!message) {
      logger.warn("Message not found or user not authorized", {
        messageId,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Message not found or access denied" });
    }

    await message.update({ status: false });

    logger.info("Message deleted successfully", {
      messageId,
      userId,
    });

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    logger.error("Error during message deletion", {
      error: error.message,
      messageId,
      userId,
    });
    return res.status(500).json({
      message: "Internal server error during message deletion",
      error: error.message,
    });
  }
};

// Edit a message
export const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { message: newMessage } = req.body;
  const userId = req.user.userId;

  try {
    const message = await Chat.findOne({
      where: {
        chatId: messageId,
        senderId: userId,
        status: true,
      },
    });

    if (!message) {
      logger.warn("Message not found or user not authorized", {
        messageId,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Message not found or access denied" });
    }

    await message.update({
      message: newMessage,
      isEdited: true,
      editedAt: new Date(),
    });

    logger.info("Message edited successfully", {
      messageId,
      userId,
    });

    return res.status(200).json({
      message: "Message edited successfully",
      data: message,
    });
  } catch (error) {
    logger.error("Error during message editing", {
      error: error.message,
      messageId,
      userId,
    });
    return res.status(500).json({
      message: "Internal server error during message editing",
      error: error.message,
    });
  }
};

export { sendMessageValidation };

export default {
  sendMessage,
  getConversationMessages,
  getUserConversations,
  markMessagesAsRead,
  deleteMessage,
  editMessage,
};
