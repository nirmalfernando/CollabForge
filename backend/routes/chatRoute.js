import express from "express";
import {
  sendMessage,
  getConversationMessages,
  getUserConversations,
  markMessagesAsRead,
  deleteMessage,
  editMessage,
  sendMessageValidation,
} from "../controllers/chatController.js";
import { verifyToken } from "../middlewares/authRole.js";

const router = express.Router();

// Send a message
router.post("/send", verifyToken, sendMessageValidation, sendMessage);

// Get user's conversations
router.get("/conversations", verifyToken, getUserConversations);

// Get messages in a specific conversation
router.get(
  "/conversations/:conversationId/messages",
  verifyToken,
  getConversationMessages
);

// Mark messages as read in a conversation
router.patch(
  "/conversations/:conversationId/read",
  verifyToken,
  markMessagesAsRead
);

// Edit a message
router.put("/messages/:messageId", verifyToken, editMessage);

// Delete a message
router.delete("/messages/:messageId", verifyToken, deleteMessage);

export default router;
