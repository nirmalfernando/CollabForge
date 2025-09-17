"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch, FiWifi, FiWifiOff } from "react-icons/fi";
import { LuSend } from "react-icons/lu";
import { IoMdAttach } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { chatApi, getAuthData } from "@/lib/api";

// Define interfaces
interface Message {
  chatId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType: 'text' | 'image' | 'file' | 'audio' | 'video';
  isRead: boolean;
  isDelivered: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    userId: string;
    name: string;
    username: string;
  };
}

interface Conversation {
  conversationId: string;
  otherParticipant: {
    userId: string;
    name: string;
    username: string;
  };
  lastMessage?: {
    chatId: string;
    message: string;
    messageType: string;
    createdAt: string;
  };
  lastMessageTime?: string;
  unreadCount: number;
  isActive: boolean;
}

const ChatsPage: React.FC = () => {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUser = getAuthData()?.user;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Socket integration
  const {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    markMessagesAsRead,
    startTyping,
    stopTyping,
    onNewMessage,
    onUserTyping,
    onUserStoppedTyping,
    onMessagesRead,
  } = useSocket();

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Handle URL parameters for direct contact
  useEffect(() => {
    const contactUserId = searchParams?.get('contactUserId');
    const contactName = searchParams?.get('contactName');
    const autoMessage = searchParams?.get('autoMessage') === 'true';
    
    console.log('URL parameters:', { contactUserId, contactName, autoMessage });
    
    if (contactUserId && contactName) {
      // Try to find existing conversation with this user
      const existingConversation = conversations.find(
        conv => conv.otherParticipant.userId === contactUserId
      );
      
      if (existingConversation) {
        console.log('Found existing conversation:', existingConversation);
        selectConversation(existingConversation);
      } else {
        console.log('Creating new conversation for:', contactName);
        // Create a new conversation object for UI purposes
        const newConversation: Conversation = {
          conversationId: '', // Will be created when first message is sent
          otherParticipant: {
            userId: contactUserId,
            name: decodeURIComponent(contactName),
            username: contactUserId.slice(0, 8), // Use first 8 chars as fallback username
          },
          lastMessage: undefined,
          lastMessageTime: undefined,
          unreadCount: 0,
          isActive: true,
        };
        
        console.log('New conversation created:', newConversation);
        setSelectedConversation(newConversation);
        setMessages([]); // Start with empty messages
        
        // Add this new conversation to the conversations list for UI
        setConversations(prev => [newConversation, ...prev]);
        
        // Optionally send initial message
        if (autoMessage) {
          console.log('Auto-sending initial contact message');
          setTimeout(() => sendInitialContactMessage(newConversation), 1000);
        }
      }
      
      // Clear URL parameters after handling
      router.replace('/brand/chat', undefined, { shallow: true });
    }
  }, [conversations, searchParams, router]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    onNewMessage((message: Message) => {
      console.log('New message received:', message);
      
      // Update messages if it's for the current conversation
      if (selectedConversation && message.conversationId === selectedConversation.conversationId) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.chatId === message.chatId)) {
            return prev;
          }
          return [...prev, message];
        });
        scrollToBottom();
      }

      // Update conversations list with latest message
      updateConversationWithNewMessage(message);
    });

    // Listen for typing indicators
    onUserTyping(({ userId, username, conversationId }) => {
      if (selectedConversation?.conversationId === conversationId && userId !== currentUser?.userId) {
        setTypingUsers(prev => new Set(prev).add(username));
      }
    });

    onUserStoppedTyping(({ userId, conversationId }) => {
      if (selectedConversation?.conversationId === conversationId) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          // Find and remove by userId (we'd need to track userId to username mapping)
          // For simplicity, clear all typing indicators when anyone stops typing
          newSet.clear();
          return newSet;
        });
      }
    });

    // Listen for read receipts
    onMessagesRead(({ conversationId, readBy }) => {
      if (selectedConversation?.conversationId === conversationId) {
        setMessages(prev => 
          prev.map(msg => 
            msg.senderId === currentUser?.userId 
              ? { ...msg, isRead: true }
              : msg
          )
        );
      }
    });

  }, [socket, selectedConversation, currentUser, onNewMessage, onUserTyping, onUserStoppedTyping, onMessagesRead, scrollToBottom]);

  // Load user conversations
  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log("Loading conversations...");
      
      // Debug: Check authentication first
      const authData = getAuthData();
      if (!authData?.token) {
        console.error("No auth token found");
        setError("Please log in to access chat");
        return;
      }
      
      console.log("Auth token exists, making API call...");
      const response = await chatApi.getUserConversations();
      console.log("Conversations response:", response);
      
      setConversations(response.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Check if it's a specific API error
      if ((error as any).status === 500) {
        setError("Server error - chat service may not be properly configured");
      } else if ((error as any).status === 401) {
        setError("Authentication failed - please log in again");
      } else if ((error as any).status === 404) {
        setError("Chat service not found - check backend routes");
      } else {
        setError("Failed to load conversations");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const response = await chatApi.getConversationMessages(conversationId);
      setMessages(response.messages || []);
      scrollToBottom();
      
      // Mark messages as read
      await chatApi.markMessagesAsRead(conversationId);
      markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Select conversation
  const selectConversation = useCallback((conversation: Conversation) => {
    // Leave previous conversation
    if (selectedConversation) {
      leaveConversation(selectedConversation.conversationId);
    }

    // Select new conversation
    setSelectedConversation(conversation);
    
    // Join new conversation room
    joinConversation(conversation.conversationId);
    
    // Load messages
    loadMessages(conversation.conversationId);
  }, [selectedConversation, joinConversation, leaveConversation]);

  // Update conversation with new message
  const updateConversationWithNewMessage = useCallback((message: Message) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.conversationId === message.conversationId
          ? {
              ...conv,
              lastMessage: {
                chatId: message.chatId,
                message: message.message,
                messageType: message.messageType,
                createdAt: message.createdAt,
              },
              lastMessageTime: message.createdAt,
              unreadCount: message.senderId !== currentUser?.userId ? conv.unreadCount + 1 : conv.unreadCount
            }
          : conv
      )
    );
  }, [currentUser]);

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || !selectedConversation || sendingMessage) {
      return;
    }

    const messageText = currentMessage.trim();
    setCurrentMessage("");
    setSendingMessage(true);

    try {
      // If this is a new conversation (no conversationId), create it first
      if (!selectedConversation.conversationId) {
        console.log("Creating new conversation with first message");
        
        // Use REST API to send first message, which will create the conversation
        const response = await chatApi.sendMessage({
          receiverId: selectedConversation.otherParticipant.userId,
          message: messageText,
          messageType: "text",
        });

        console.log("First message response:", response);

        // Update the conversation with the new conversation ID
        if (response.data?.conversationId) {
          const updatedConversation = {
            ...selectedConversation,
            conversationId: response.data.conversationId,
            lastMessage: {
              chatId: response.data.chatId,
              message: messageText,
              messageType: "text",
              createdAt: response.data.createdAt,
            },
            lastMessageTime: response.data.createdAt,
          };
          
          setSelectedConversation(updatedConversation);
          
          // Update the conversation in the list
          setConversations(prev => 
            prev.map(conv => 
              conv.otherParticipant.userId === selectedConversation.otherParticipant.userId
                ? updatedConversation
                : conv
            )
          );
          
          // Join the conversation room
          joinConversation(response.data.conversationId);
          
          // Add message to messages list
          setMessages([response.data]);
          
          console.log("New conversation created successfully!");
        }
      } else {
        // Send via socket for existing conversations
        console.log("Sending message via socket for existing conversation");
        sendMessage({
          receiverId: selectedConversation.otherParticipant.userId,
          message: messageText,
          messageType: "text",
        });
      }

      // Stop typing indicator
      if (selectedConversation.conversationId) {
        stopTyping(selectedConversation.conversationId);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message text on error
      setCurrentMessage(messageText);
    } finally {
      setSendingMessage(false);
    }
  };

  // Auto-send initial message for new conversations from contact button
  const sendInitialContactMessage = async (conversation: Conversation) => {
    try {
      const initialMessage = `Hi ${conversation.otherParticipant.name}! I'm interested in collaborating with you.`;
      
      console.log("Sending initial contact message:", initialMessage);
      
      const response = await chatApi.sendMessage({
        receiverId: conversation.otherParticipant.userId,
        message: initialMessage,
        messageType: "text",
      });

      console.log("Initial message response:", response);

      if (response.data?.conversationId) {
        const updatedConversation = {
          ...conversation,
          conversationId: response.data.conversationId,
          lastMessage: {
            chatId: response.data.chatId,
            message: initialMessage,
            messageType: "text",
            createdAt: response.data.createdAt,
          },
          lastMessageTime: response.data.createdAt,
        };
        
        setSelectedConversation(updatedConversation);
        
        // Update the conversation in the list
        setConversations(prev => 
          prev.map(conv => 
            conv.otherParticipant.userId === conversation.otherParticipant.userId
              ? updatedConversation
              : conv
          )
        );
        
        // Join the conversation room
        joinConversation(response.data.conversationId);
        
        // Add message to messages list
        setMessages([response.data]);
        
        console.log("Initial contact message sent successfully!");
      }
    } catch (error) {
      console.error('Error sending initial contact message:', error);
    }
  };

  // Typing handler
  const handleTyping = (value: string) => {
    setCurrentMessage(value);

    if (!selectedConversation || !selectedConversation.conversationId) return;

    // Start typing indicator
    if (!isTyping) {
      setIsTyping(true);
      startTyping(selectedConversation.conversationId);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (selectedConversation.conversationId) {
        stopTyping(selectedConversation.conversationId);
      }
    }, 3000);
  };

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Check if user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.some(user => user.userId === userId);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (selectedConversation) {
        leaveConversation(selectedConversation.conversationId);
      }
    };
  }, [selectedConversation, leaveConversation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Main Chat Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar - Chat List */}
        <aside className="w-80 border-r border-gray-700 overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chats</h2>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <FiWifi className="text-green-500" size={16} />
                ) : (
                  <FiWifiOff className="text-red-500" size={16} />
                )}
                <span className="text-xs text-gray-400">
                  {onlineUsers.length} online
                </span>
              </div>
            </div>
          </div>

          <ul>
            {conversations.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Start a conversation to begin chatting</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <li
                  key={conversation.conversationId}
                  className={`flex items-start px-6 py-3 cursor-pointer transition-colors ${
                    selectedConversation?.conversationId === conversation.conversationId
                      ? "bg-gray-800"
                      : "hover:bg-gray-800"
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="relative">
                    <img
                      src={`https://via.placeholder.com/40?text=${conversation.otherParticipant.name[0]}`}
                      alt={conversation.otherParticipant.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {isUserOnline(conversation.otherParticipant.userId) && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold truncate">
                        {conversation.otherParticipant.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        {conversation.lastMessage && 
                          formatMessageTime(conversation.lastMessage.createdAt)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-300 truncate">
                        {conversation.lastMessage?.message || "No messages yet"}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Main Chat Area */}
        <section className="flex flex-col flex-1">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={`https://via.placeholder.com/40?text=${selectedConversation.otherParticipant.name[0]}`}
                      alt={selectedConversation.otherParticipant.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {isUserOnline(selectedConversation.otherParticipant.userId) && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <span className="font-semibold">
                      {selectedConversation.otherParticipant.name}
                    </span>
                    <span className="block text-sm text-gray-400">
                      {isUserOnline(selectedConversation.otherParticipant.userId) ? (
                        <span className="text-green-500">Online</span>
                      ) : (
                        "Offline"
                      )}
                    </span>
                  </div>
                </div>
                <FiSearch className="text-gray-400 cursor-pointer hover:text-white" size={20} />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Show welcome message for new conversations */}
                {!selectedConversation.conversationId && messages.length === 0 && (
                  <div className="flex justify-center">
                    <div className="bg-gray-800 rounded-lg px-4 py-2 text-center text-gray-300">
                      <p className="text-sm">
                        Start a conversation with {selectedConversation.otherParticipant.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Send your first message below
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.chatId}
                    className={`flex ${
                      message.senderId === currentUser?.userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-md ${
                        message.senderId === currentUser?.userId
                          ? "bg-blue-600"
                          : "bg-gray-800"
                      }`}
                    >
                      <p>{message.message}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs text-gray-400">
                          {formatMessageTime(message.createdAt)}
                        </span>
                        {message.senderId === currentUser?.userId && (
                          <span className="text-xs">
                            {message.isRead ? "✓✓" : message.isDelivered ? "✓" : "○"}
                          </span>
                        )}
                        {message.isEdited && (
                          <span className="text-xs text-gray-500">edited</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {Array.from(typingUsers).join(", ")} typing...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex items-center px-6 py-4 border-t border-gray-700">
                <div className="text-gray-400 mr-1 text-[20px] cursor-pointer">😊</div>
                <IoMdAttach className="text-blue-500 cursor-pointer mr-2" size={25} />
                
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  disabled={sendingMessage}
                  className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!currentMessage.trim() || sendingMessage}
                  className="ml-3 text-blue-500 hover:text-blue-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                >
                  <LuSend size={25} />
                </button>
              </form>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start chatting</p>
                {!isConnected && (
                  <div className="mt-4 text-red-400">
                    <FiWifiOff className="mx-auto mb-2" size={24} />
                    <p>Reconnecting to chat server...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ChatsPage;