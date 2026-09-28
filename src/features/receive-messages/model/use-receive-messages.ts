import { useQuery } from "@tanstack/react-query";
import {
  deleteNotification,
  receiveNotification,
} from "@/shared/api/green-api";
import { useChatStore } from "@/entities/chat/model/chat-store";

const POLLING_INTERVAL = 500;

export const useReceiveMessages = () => {
  const credentials = useChatStore((state) => state.credentials);
  const addMessage = useChatStore((state) => state.addMessage);

  return useQuery({
    queryKey: ["notifications", credentials?.idInstance],
    enabled: Boolean(credentials),
    retry: false,
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: true,
    queryFn: async ({ signal }) => {
      if (!credentials) return null;

      const notification = await receiveNotification(credentials, signal);
      if (!notification) return null;

      const { body } = notification;
      const isIncomingText =
        body.typeWebhook === "incomingMessageReceived" &&
        body.messageData?.typeMessage === "textMessage" &&
        Boolean(body.senderData?.chatId) &&
        Boolean(body.messageData.textMessageData?.textMessage);

      if (isIncomingText && body.senderData && body.messageData?.textMessageData) {
        addMessage(
          {
            id: body.idMessage,
            chatId: body.senderData.chatId,
            text: body.messageData.textMessageData.textMessage,
            timestamp: body.timestamp * 1000,
            direction: "incoming",
            status: "received",
          },
          body.senderData.chatName || body.senderData.senderName,
        );
      }

      await deleteNotification(credentials, notification.receiptId);
      return notification.receiptId;
    },
  });
};
