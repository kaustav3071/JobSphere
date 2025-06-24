import React, { createContext, useContext, useState } from "react";

// Create the context
export const ChatContext = createContext();

// Custom hook for consuming ChatContext
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Provider component
export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]); // all chats
  const [activeChat, setActiveChat] = useState(null);      // selected chat
  const [messages, setMessages] = useState([]);            // messages of active chat

  // Select a conversation and load messages
  const openChat = (chatId) => {
    setActiveChat(chatId);
    // Optional: fetch messages via API here
    // Example: fetchMessages(chatId).then(setMessages)
  };

  // Add a new message
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  // Clear all chat state (e.g. on logout)
  const resetChat = () => {
    setConversations([]);
    setActiveChat(null);
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        setConversations,
        activeChat,
        setActiveChat,
        messages,
        setMessages,
        openChat,
        addMessage,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
