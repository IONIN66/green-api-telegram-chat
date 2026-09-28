import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Chat, Credentials, Message } from "@/shared/types/chat";

type ChatState = {
  credentials: Credentials | null;
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  setCredentials: (credentials: Credentials) => void;
  clearSession: () => void;
  addChat: (chatId: string, title?: string) => void;
  setActiveChat: (chatId: string) => void;
  addMessage: (message: Message, chatTitle?: string) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
};

const INITIAL_STATE = {
  credentials: null,
  chats: [],
  messages: {},
  activeChatId: null,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setCredentials: (credentials) => set({ credentials }),
      clearSession: () => set(INITIAL_STATE),
      addChat: (chatId, title) =>
        set((state) => {
          const hasChat = state.chats.some((chat) => chat.id === chatId);
          if (hasChat) return { activeChatId: chatId };

          return {
            chats: [{ id: chatId, title: title || chatId }, ...state.chats],
            messages: { ...state.messages, [chatId]: [] },
            activeChatId: chatId,
          };
        }),
      setActiveChat: (activeChatId) => set({ activeChatId }),
      addMessage: (message, chatTitle) =>
        set((state) => {
          const chatMessages = state.messages[message.chatId] ?? [];
          const hasMessage = chatMessages.some(
            (chatMessage) => chatMessage.id === message.id,
          );
          if (hasMessage) return state;

          const existingChat = state.chats.find((chat) => chat.id === message.chatId);
          const updatedChat: Chat = {
            id: message.chatId,
            title: chatTitle || existingChat?.title || message.chatId,
            lastMessage: message.text,
          };
          const chats = existingChat
            ? state.chats.map((chat) =>
                chat.id === message.chatId ? updatedChat : chat,
              )
            : [updatedChat, ...state.chats];

          return {
            chats,
            messages: {
              ...state.messages,
              [message.chatId]: [...chatMessages, message],
            },
          };
        }),
      updateMessage: (chatId, messageId, updates) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] ?? []).map((message) =>
              message.id === messageId ? { ...message, ...updates } : message,
            ),
          },
        })),
    }),
    {
      name: "green-api-chat",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
