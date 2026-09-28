export type SendMessageResponse = {
  idMessage: string;
};

export type CheckAccountResponse = {
  exist?: boolean;
  chatId?: string;
  username?: string;
  phoneNumber?: number;
  fromCache?: boolean;
  status?: boolean;
  reason?: string;
  data?: {
    reason?: string;
  };
};

export type GreenApiErrorResponse = {
  reason?: string;
  data?: {
    reason?: string;
  };
};

export type IncomingNotification = {
  receiptId: number;
  body: {
    typeWebhook: string;
    timestamp: number;
    idMessage: string;
    senderData?: {
      chatId: string;
      chatName?: string;
      senderName?: string;
    };
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
};
