"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ChatUser {
  id: string;
  name: string;
  lastname: string;
  profileImage?: string;
}

interface ChatContextType {
  activeChat: ChatUser | null;
  openChat: (user: ChatUser) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType>({
  activeChat: null,
  openChat: () => {},
  closeChat: () => {},
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);

  const openChat = (user: ChatUser) => setActiveChat(user);
  const closeChat = () => setActiveChat(null);

  return (
    <ChatContext.Provider value={{ activeChat, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
