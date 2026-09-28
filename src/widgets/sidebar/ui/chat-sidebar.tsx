import { useState, type FC } from "react";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconLogout, IconMessagePlus } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateChatModal } from "@/features/create-chat/ui/create-chat-modal";
import { useChatStore } from "@/entities/chat/model/chat-store";
import styles from "./chat-sidebar.module.css";

interface IChatSidebarProps {
  children?: never;
}

export const ChatSidebar: FC<IChatSidebarProps> = () => {
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const clearSession = useChatStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  const [showCreateChat, setShowCreateChat] = useState(false);

  const handleLogout = () => {
    queryClient.clear();
    clearSession();
  };

  return (
    <Paper
      component="aside"
      radius={0}
      className={`${styles.sidebar} ${activeChatId ? styles.chatSelected : ""}`}
    >
      <Group component="header" justify="space-between" p="md" className={styles.header}>
        <div>
          <Text fw={700} size="lg">
            Сообщения
          </Text>
          <Text size="xs" c="dimmed">
            GREEN-API · Telegram
          </Text>
        </div>
        <Group gap={3}>
          <Tooltip label="Новый чат">
            <ActionIcon
              variant="subtle"
              size="lg"
              aria-label="Новый чат"
              onClick={() => setShowCreateChat(true)}
            >
              <IconMessagePlus size={21} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Выйти">
            <ActionIcon
              color="gray"
              variant="subtle"
              size="lg"
              aria-label="Выйти"
              onClick={handleLogout}
            >
              <IconLogout size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <ScrollArea className={styles.list} p={7}>
        {chats.length === 0 ? (
          <Stack h="100%" align="center" justify="center" gap="md" p="xl">
            <Text c="dimmed" size="sm" ta="center">
              Здесь появятся ваши чаты
            </Text>
            <Button
              variant="light"
              leftSection={<IconMessagePlus size={17} />}
              onClick={() => setShowCreateChat(true)}
            >
              Новый чат
            </Button>
          </Stack>
        ) : (
          chats.map((chat) => (
            <button
              className={`${styles.chat} ${chat.id === activeChatId ? styles.activeChat : ""}`}
              key={chat.id}
              type="button"
              onClick={() => setActiveChat(chat.id)}
            >
              <Avatar color="blue" radius="xl">
                {chat.title.slice(0, 1).toUpperCase()}
              </Avatar>
              <span className={styles.chatCopy}>
                <Text fw={600} truncate>
                  {chat.title}
                </Text>
                <Text size="sm" c="dimmed" truncate>
                  {chat.lastMessage || `Chat ID: ${chat.id}`}
                </Text>
              </span>
            </button>
          ))
        )}
      </ScrollArea>

      <CreateChatModal
        isOpen={showCreateChat}
        onClose={() => setShowCreateChat(false)}
      />
    </Paper>
  );
};
