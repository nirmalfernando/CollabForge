export interface MessageNotification {
  id: string;
  conversationId: string;
  sender: {
    userId: string;
    name: string;
    username: string;
  };
  message: string;
  timestamp: string;
}

// Format timestamp for different contexts
export const formatChatTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Format message time (for individual messages)
export const formatMessageTime = (timestamp: string | Date): string => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Truncate long messages for preview
export const truncateMessage = (message: string, maxLength: number = 50): string => {
  if (message.length <= maxLength) {
    return message;
  }
  return message.slice(0, maxLength) + '...';
};

// Generate conversation key for consistent ordering
export const generateConversationKey = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};

// Check if message contains mentions
export const extractMentions = (message: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(message)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

// Generate notification text
export const generateNotificationText = (
  senderName: string, 
  message: string, 
  messageType: string = 'text'
): string => {
  if (messageType === 'image') {
    return `${senderName} sent a photo`;
  } else if (messageType === 'file') {
    return `${senderName} sent a file`;
  } else if (messageType === 'audio') {
    return `${senderName} sent an audio message`;
  } else if (messageType === 'video') {
    return `${senderName} sent a video`;
  }
  
  return `${senderName}: ${truncateMessage(message, 30)}`;
};

// Show browser notification (if permitted)
export const showBrowserNotification = (notification: MessageNotification) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const browserNotification = new Notification(
      generateNotificationText(
        notification.sender.name, 
        notification.message
      ),
      {
        icon: '/favicon.ico', // Your app icon
        badge: '/favicon.ico',
        tag: notification.conversationId, // Prevent duplicate notifications
      }
    );

    // Auto-close after 5 seconds
    setTimeout(() => {
      browserNotification.close();
    }, 5000);

    return browserNotification;
  }
  return null;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission;
  }
  return 'denied';
};

// Sound utility for message notifications
export const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/message.mp3'); // Add a notification sound file
    audio.volume = 0.3;
    audio.play().catch(console.error);
  } catch (error) {
    console.error('Could not play notification sound:', error);
  }
};

// Typing debounce utility
export const createTypingDebouncer = (callback: () => void, delay: number = 3000) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(callback, delay);
  };
};

// Message validation
export const validateMessage = (message: string): boolean => {
  return message.trim().length > 0 && message.trim().length <= 2000;
};

// File upload validation for attachments
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'video/mp4', 'video/webm', 'video/ogg'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
};

// Connection status utility
export const getConnectionStatusColor = (isConnected: boolean): string => {
  return isConnected ? 'text-green-500' : 'text-red-500';
};

export const getConnectionStatusText = (isConnected: boolean): string => {
  return isConnected ? 'Connected' : 'Reconnecting...';
};

// Message grouping (group messages by sender and time)
export const groupMessages = (messages: any[], maxGapMinutes: number = 5) => {
  const groups: any[][] = [];
  let currentGroup: any[] = [];

  messages.forEach((message, index) => {
    if (index === 0) {
      currentGroup = [message];
    } else {
      const prevMessage = messages[index - 1];
      const timeDiff = new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      if (
        prevMessage.senderId === message.senderId && 
        minutesDiff <= maxGapMinutes
      ) {
        currentGroup.push(message);
      } else {
        groups.push(currentGroup);
        currentGroup = [message];
      }
    }

    if (index === messages.length - 1) {
      groups.push(currentGroup);
    }
  });

  return groups;
};

// Local storage utilities for chat preferences
export const saveChatPreferences = (preferences: {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chatPreferences', JSON.stringify(preferences));
  }
};

export const loadChatPreferences = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatPreferences');
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return {
    notificationsEnabled: false,
    soundEnabled: true,
    theme: 'dark'
  };
};

// Draft message handling
export const saveDraftMessage = (conversationId: string, message: string) => {
  if (typeof window !== 'undefined' && message.trim()) {
    const drafts = JSON.parse(localStorage.getItem('messageDrafts') || '{}');
    drafts[conversationId] = message;
    localStorage.setItem('messageDrafts', JSON.stringify(drafts));
  }
};

export const loadDraftMessage = (conversationId: string): string => {
  if (typeof window !== 'undefined') {
    const drafts = JSON.parse(localStorage.getItem('messageDrafts') || '{}');
    return drafts[conversationId] || '';
  }
  return '';
};

export const clearDraftMessage = (conversationId: string) => {
  if (typeof window !== 'undefined') {
    const drafts = JSON.parse(localStorage.getItem('messageDrafts') || '{}');
    delete drafts[conversationId];
    localStorage.setItem('messageDrafts', JSON.stringify(drafts));
  }
};
