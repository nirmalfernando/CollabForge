import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import logger from "../middlewares/logger.js";

const JWT = process.env.JWT;

// Store active users and their socket connections
const activeUsers = new Map();

// Socket authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, JWT);
    const user = await User.findOne({
      where: { userId: decoded.userId, status: true },
      attributes: ["userId", "username", "name", "role"],
    });

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    logger.error("Socket authentication error", { error: error.message });
    next(new Error("Authentication error: Invalid token"));
  }
};

// Initialize socket handlers
export const initializeSocket = (io) => {
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const user = socket.user;

    logger.info("User connected to socket", {
      userId: user.userId,
      username: user.username,
      socketId: socket.id,
    });

    // Add user to active users
    activeUsers.set(user.userId, {
      socketId: socket.id,
      user: user,
      lastSeen: new Date(),
    });

    // Join user to their personal room
    socket.join(user.userId);

    // Emit user online status to all connected users
    socket.broadcast.emit("user_online", {
      userId: user.userId,
      username: user.username,
      lastSeen: new Date(),
    });

    // Handle joining conversation rooms
    socket.on("join_conversation", async (data) => {
      try {
        const { conversationId } = data;

        // Verify user is part of this conversation
        const conversation = await Conversation.findOne({
          where: {
            conversationId,
            [Op.or]: [
              { participant1Id: user.userId },
              { participant2Id: user.userId },
            ],
            status: true,
          },
        });

        if (conversation) {
          socket.join(conversationId);
          logger.info("User joined conversation", {
            userId: user.userId,
            conversationId,
          });

          socket.emit("conversation_joined", { conversationId });
        } else {
          socket.emit("error", {
            message: "Conversation not found or access denied",
          });
        }
      } catch (error) {
        logger.error("Error joining conversation", { error: error.message });
        socket.emit("error", { message: "Failed to join conversation" });
      }
    });

    // Handle leaving conversation rooms
    socket.on("leave_conversation", (data) => {
      const { conversationId } = data;
      socket.leave(conversationId);
      logger.info("User left conversation", {
        userId: user.userId,
        conversationId,
      });
      socket.emit("conversation_left", { conversationId });
    });

    // Handle sending messages
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, message, messageType = "text" } = data;

        // Validate input
        if (!receiverId || !message || message.trim().length === 0) {
          socket.emit("error", { message: "Invalid message data" });
          return;
        }

        // Check if receiver exists
        const receiver = await User.findOne({
          where: { userId: receiverId, status: true },
        });

        if (!receiver) {
          socket.emit("error", { message: "Receiver not found" });
          return;
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
          where: {
            [Op.or]: [
              {
                participant1Id: user.userId,
                participant2Id: receiverId,
              },
              {
                participant1Id: receiverId,
                participant2Id: user.userId,
              },
            ],
            status: true,
          },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            conversationId: uuidv4(),
            participant1Id: user.userId,
            participant2Id: receiverId,
            isActive: true,
            status: true,
          });
        }

        // Create the message
        const newMessage = await Chat.create({
          chatId: uuidv4(),
          conversationId: conversation.conversationId,
          senderId: user.userId,
          receiverId: receiverId,
          message: message.trim(),
          messageType,
          isDelivered: activeUsers.has(receiverId), // Mark as delivered if receiver is online
          status: true,
        });

        // Update conversation's last message info
        await conversation.update({
          lastMessageId: newMessage.chatId,
          lastMessageTime: newMessage.createdAt,
        });

        // Get complete message data with sender info
        const messageWithSender = {
          chatId: newMessage.chatId,
          conversationId: newMessage.conversationId,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
          message: newMessage.message,
          messageType: newMessage.messageType,
          isRead: newMessage.isRead,
          isDelivered: newMessage.isDelivered,
          isEdited: newMessage.isEdited,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
          sender: {
            userId: user.userId,
            name: user.name,
            username: user.username,
          },
        };

        // Emit to conversation room
        io.to(conversation.conversationId).emit(
          "new_message",
          messageWithSender
        );

        // Also emit to receiver's personal room for notifications
        io.to(receiverId).emit("message_notification", {
          conversationId: conversation.conversationId,
          sender: {
            userId: user.userId,
            name: user.name,
            username: user.username,
          },
          message: message.trim(),
          messageType,
          createdAt: newMessage.createdAt,
        });

        logger.info("Message sent via socket", {
          chatId: newMessage.chatId,
          senderId: user.userId,
          receiverId,
          conversationId: conversation.conversationId,
        });
      } catch (error) {
        logger.error("Error sending message via socket", {
          error: error.message,
          userId: user.userId,
        });
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicators
    socket.on("typing_start", (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit("user_typing", {
        userId: user.userId,
        username: user.username,
        conversationId,
      });
    });

    socket.on("typing_stop", (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit("user_stopped_typing", {
        userId: user.userId,
        conversationId,
      });
    });

    // Handle message read receipts
    socket.on("mark_messages_read", async (data) => {
      try {
        const { conversationId } = data;

        // Verify user is part of the conversation
        const conversation = await Conversation.findOne({
          where: {
            conversationId,
            [Op.or]: [
              { participant1Id: user.userId },
              { participant2Id: user.userId },
            ],
            status: true,
          },
        });

        if (!conversation) {
          socket.emit("error", {
            message: "Conversation not found or access denied",
          });
          return;
        }

        // Mark messages as read
        await Chat.update(
          { isRead: true },
          {
            where: {
              conversationId,
              receiverId: user.userId,
              isRead: false,
              status: true,
            },
          }
        );

        // Update conversation last read timestamp
        const updateField =
          conversation.participant1Id === user.userId
            ? "participant1LastRead"
            : "participant2LastRead";

        await conversation.update({
          [updateField]: new Date(),
        });

        // Notify other participants that messages were read
        socket.to(conversationId).emit("messages_read", {
          conversationId,
          readBy: user.userId,
          readAt: new Date(),
        });

        socket.emit("messages_marked_read", { conversationId });
      } catch (error) {
        logger.error("Error marking messages as read via socket", {
          error: error.message,
          userId: user.userId,
        });
        socket.emit("error", { message: "Failed to mark messages as read" });
      }
    });

    // Handle getting online users
    socket.on("get_online_users", () => {
      const onlineUsers = Array.from(activeUsers.values()).map((userData) => ({
        userId: userData.user.userId,
        username: userData.user.username,
        name: userData.user.name,
        lastSeen: userData.lastSeen,
      }));

      socket.emit("online_users", onlineUsers);
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      logger.info("User disconnected from socket", {
        userId: user.userId,
        username: user.username,
        reason,
        socketId: socket.id,
      });

      // Remove user from active users
      activeUsers.delete(user.userId);

      // Emit user offline status to all connected users
      socket.broadcast.emit("user_offline", {
        userId: user.userId,
        username: user.username,
        lastSeen: new Date(),
      });
    });

    // Handle connection errors
    socket.on("error", (error) => {
      logger.error("Socket error", {
        error: error.message,
        userId: user.userId,
        socketId: socket.id,
      });
    });
  });

  // Handle connection errors at the server level
  io.on("connect_error", (error) => {
    logger.error("Socket connection error", { error: error.message });
  });

  logger.info("Socket.IO server initialized successfully");
};

export default initializeSocket;
