import { useState, type FC } from "react";
import { ActionIcon, Group, Textarea } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { IconSend2 } from "@tabler/icons-react";
import { useChatStore } from "@/entities/chat/model/chat-store";
import { sendMessage } from "@/shared/api/green-api";
import styles from "./message-composer.module.css";

interface IMessageComposerProps {
  chatId: string;
}

export const MessageComposer: FC<IMessageComposerProps> = (props) => {
  const { chatId } = props;
  const credentials = useChatStore((state) => state.credentials);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const [messageText, setMessageText] = useState("");

  const sendMessageMutation = useMutation({
    mutationFn: async (variables: { text: string; temporaryId: string }) => {
      if (!credentials) throw new Error("Нет данных подключения");
      const response = await sendMessage(credentials, chatId, variables.text);
      return { ...response, temporaryId: variables.temporaryId };
    },
    onSuccess: (response) => {
      updateMessage(chatId, response.temporaryId, {
        id: response.idMessage,
        status: "sent",
      });
    },
    onError: (_error, variables) => {
      updateMessage(chatId, variables.temporaryId, { status: "failed" });
    },
  });

  const canSubmit = Boolean(
    messageText.trim() &&
      messageText.length <= 4096 &&
      !sendMessageMutation.isPending,
  );

  const handleSubmit = () => {
    const text = messageText.trim();
    if (!text || !canSubmit) return;

    const temporaryId = crypto.randomUUID();
    addMessage({
      id: temporaryId,
      chatId,
      text,
      timestamp: Date.now(),
      direction: "outgoing",
      status: "sending",
    });
    setMessageText("");
    sendMessageMutation.mutate({ text, temporaryId });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Group align="flex-end" gap="sm" wrap="nowrap" className={styles.composer}>
      <Textarea
        aria-label="Сообщение"
        placeholder="Сообщение"
        value={messageText}
        onChange={(event) => setMessageText(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        autosize
        minRows={1}
        maxRows={5}
        maxLength={4096}
        className={styles.input}
        error={sendMessageMutation.isError ? "Не удалось отправить сообщение" : null}
      />
      <ActionIcon
        aria-label="Отправить сообщение"
        size={46}
        radius="xl"
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        <IconSend2 size={21} />
      </ActionIcon>
    </Group>
  );
};
