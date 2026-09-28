import { useEffect, useRef, type FC } from "react";
import {
  ActionIcon,
  Avatar,
  Box,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconChecks,
  IconMessageCircle,
} from "@tabler/icons-react";
import { MessageComposer } from "@/features/send-message/ui/message-composer";
import { useChatStore } from "@/entities/chat/model/chat-store";
import styles from "./chat-window.module.css";

const formatMessageTime = (timestamp: number) =>
  new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

interface IMessageStatusIconProps {
  status: string;
}

const MessageStatusIcon: FC<IMessageStatusIconProps> = (props) => {
  const { status } = props;

  if (status === "sending") return <IconCheck size={14} opacity={0.55} />;
  if (status === "failed") return <span className={styles.messageError}>!</span>;
  return <IconChecks size={15} />;
};

interface IChatWindowProps {
  children?: never;
}

export const ChatWindow: FC<IChatWindowProps> = () => {
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const messages = useChatStore((state) => state.messages);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const activeMessages = activeChatId ? messages[activeChatId] ?? [] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  if (!activeChat || !activeChatId) {
    return (
      <Center component="section" className={styles.emptyChat}>
        <Stack align="center" gap={7}>
          <ThemeIcon
            size={76}
            radius="xl"
            variant="gradient"
            gradient={{ from: "#50a8e7", to: "#2481cc", deg: 145 }}
            className={styles.emptyIcon}
          >
          <IconMessageCircle size={38} />
          </ThemeIcon>
          <Text fw={600} size="lg">
            Выберите чат
          </Text>
          <Text c="dimmed" size="sm">
            или создайте новый, чтобы отправить сообщение
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box component="section" className={styles.window}>
      <Group component="header" gap="sm" px="lg" py="sm" className={styles.header}>
        <ActionIcon
          className={styles.mobileBack}
          variant="subtle"
          color="gray"
          aria-label="Назад к чатам"
          onClick={() => setActiveChat("")}
        >
          <IconArrowLeft size={22} />
        </ActionIcon>
        <Avatar color="blue" radius="xl">
          {activeChat.title.slice(0, 1).toUpperCase()}
        </Avatar>
        <div>
          <Text fw={600}>{activeChat.title}</Text>
          <Text size="xs" c="dimmed">
            Chat ID: {activeChat.id}
          </Text>
        </div>
      </Group>

      <div className={styles.messages}>
        {activeMessages.length === 0 && (
          <Stack gap={0} className={styles.conversationStart}>
            <Text fw={600}>Начало диалога</Text>
            <Text size="sm" c="dimmed">
              Отправьте первое текстовое сообщение
            </Text>
          </Stack>
        )}
        {activeMessages.map((message) => (
          <Group
            justify={message.direction === "outgoing" ? "flex-end" : "flex-start"}
            className={styles.messageRow}
            key={message.id}
          >
            <Box
              className={`${styles.messageBubble} ${message.direction === "outgoing" ? styles.outgoingBubble : styles.incomingBubble}`}
            >
              <Text className={styles.messageText}>{message.text}</Text>
              <span className={styles.messageMeta}>
                {formatMessageTime(message.timestamp)}
                {message.direction === "outgoing" && (
                  <MessageStatusIcon status={message.status} />
                )}
              </span>
            </Box>
          </Group>
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageComposer chatId={activeChatId} />
    </Box>
  );
};
