export type Credentials = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
};

export type Chat = {
  id: string;
  title: string;
  lastMessage?: string;
};

export type MessageDirection = "incoming" | "outgoing";
export type MessageStatus = "sending" | "sent" | "failed" | "received";

export type Message = {
  id: string;
  chatId: string;
  text: string;
  timestamp: number;
  direction: MessageDirection;
  status: MessageStatus;
};
