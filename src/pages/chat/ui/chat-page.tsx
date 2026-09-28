import type { FC } from "react";
import { Alert, Box } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useReceiveMessages } from "@/features/receive-messages/model/use-receive-messages";
import { ChatSidebar } from "@/widgets/sidebar/ui/chat-sidebar";
import { ChatWindow } from "@/widgets/chat-window/ui/chat-window";
import styles from "./chat-page.module.css";

interface IChatPageProps {
  children?: never;
}

export const ChatPage: FC<IChatPageProps> = () => {
  const notificationsQuery = useReceiveMessages();

  return (
    <Box component="main" className={styles.shell}>
      {notificationsQuery.isError && (
        <Alert
          className={styles.alert}
          color="red"
          icon={<IconAlertCircle size={18} />}
          title="Нет соединения с GREEN-API"
        >
          Проверьте API URL, ID и токен инстанса, а также настройки входящих
          уведомлений.
        </Alert>
      )}
      <ChatSidebar />
      <ChatWindow />
    </Box>
  );
};
