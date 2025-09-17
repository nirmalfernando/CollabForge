import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuthData } from '@/lib/api';

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

interface OnlineUser {
  userId: string;
  username: string;
  name: string;
  lastSeen: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: OnlineUser[];
  sendMessage: (data: {
    receiverId: string;
    message: string;
    messageType?: 'text' | 'image' | 'file' | 'audio' | 'video';
  }) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  markMessagesAsRead: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => void;
  onMessageNotification: (callback: (notification: any) => void) => void;
  onUserTyping: (callback: (data: { userId: string; username: string; conversationId: string }) => void) => void;
  onUserStoppedTyping: (callback: (data: { userId: string; conversationId: string }) => void) => void;
  onUserOnline: (callback: (user: OnlineUser) => void) => void;
  onUserOffline: (callback: (user: OnlineUser) => void) => void;
  onMessagesRead: (callback: (data: { conversationId: string; readBy: string; readAt: string }) => void) => void;
  disconnect: () => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 
                  'https://collabforge.onrender.com';

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const authData = getAuthData();
    
    if (!authData?.token) {
      console.warn('No auth token found, cannot connect to socket');
      return;
    }

    console.log('Initializing socket connection to:', SOCKET_URL);
    
    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: authData.token,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Get online users when connected
      socketInstance.emit('get_online_users');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      // Auto-reconnect logic
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          setTimeout(() => {
            socketInstance.connect();
          }, 1000 * reconnectAttempts.current);
        }
      }
    });

    // Handle online users
    socketInstance.on('online_users', (users: OnlineUser[]) => {
      console.log('Online users updated:', users);
      setOnlineUsers(users);
    });

    socketInstance.on('user_online', (user: OnlineUser) => {
      console.log('User came online:', user);
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.userId !== user.userId);
        return [...filtered, user];
      });
    });

    socketInstance.on('user_offline', (user: OnlineUser) => {
      console.log('User went offline:', user);
      setOnlineUsers(prev => prev.filter(u => u.userId !== user.userId));
    });

    // Handle errors
    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      console.log('Cleaning up socket connection');
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  // Socket methods
  const sendMessage = useCallback((data: {
    receiverId: string;
    message: string;
    messageType?: 'text' | 'image' | 'file' | 'audio' | 'video';
  }) => {
    if (socket && isConnected) {
      console.log('Sending message via socket:', data);
      socket.emit('send_message', data);
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  }, [socket, isConnected]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      console.log('Joining conversation:', conversationId);
      socket.emit('join_conversation', { conversationId });
    }
  }, [socket, isConnected]);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      console.log('Leaving conversation:', conversationId);
      socket.emit('leave_conversation', { conversationId });
    }
  }, [socket, isConnected]);

  const markMessagesAsRead = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('mark_messages_read', { conversationId });
    }
  }, [socket, isConnected]);

  const startTyping = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { conversationId });
    }
  }, [socket, isConnected]);

  const stopTyping = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { conversationId });
    }
  }, [socket, isConnected]);

  // Event listeners
  const onNewMessage = useCallback((callback: (message: Message) => void) => {
    if (socket) {
      socket.on('new_message', callback);
    }
  }, [socket]);

  const onMessageNotification = useCallback((callback: (notification: any) => void) => {
    if (socket) {
      socket.on('message_notification', callback);
    }
  }, [socket]);

  const onUserTyping = useCallback((callback: (data: { userId: string; username: string; conversationId: string }) => void) => {
    if (socket) {
      socket.on('user_typing', callback);
    }
  }, [socket]);

  const onUserStoppedTyping = useCallback((callback: (data: { userId: string; conversationId: string }) => void) => {
    if (socket) {
      socket.on('user_stopped_typing', callback);
    }
  }, [socket]);

  const onUserOnline = useCallback((callback: (user: OnlineUser) => void) => {
    if (socket) {
      socket.on('user_online', callback);
    }
  }, [socket]);

  const onUserOffline = useCallback((callback: (user: OnlineUser) => void) => {
    if (socket) {
      socket.on('user_offline', callback);
    }
  }, [socket]);

  const onMessagesRead = useCallback((callback: (data: { conversationId: string; readBy: string; readAt: string }) => void) => {
    if (socket) {
      socket.on('messages_read', callback);
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
  }, [socket]);

  return {
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
    onMessageNotification,
    onUserTyping,
    onUserStoppedTyping,
    onUserOnline,
    onUserOffline,
    onMessagesRead,
    disconnect,
  };
};
