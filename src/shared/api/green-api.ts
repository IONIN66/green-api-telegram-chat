import axios from "axios";
import type { Credentials } from "@/shared/types/chat";
import type {
  CheckAccountResponse,
  IncomingNotification,
  SendMessageResponse,
} from "./green-api.types";

const getInstanceUrl = (credentials: Credentials) => {
  const apiUrl = credentials.apiUrl.replace(/\/$/, "");
  return `${apiUrl}/waInstance${credentials.idInstance}`;
};

export const sendMessage = async (
  credentials: Credentials,
  chatId: string,
  message: string,
) => {
  const instanceUrl = getInstanceUrl(credentials);
  const response = await axios.post<SendMessageResponse>(
    `${instanceUrl}/sendMessage/${credentials.apiTokenInstance}`,
    { chatId, message },
  );

  return response.data;
};

export const checkAccount = async (
  credentials: Credentials,
  phoneNumber: number,
) => {
  const instanceUrl = getInstanceUrl(credentials);
  const response = await axios.post<CheckAccountResponse>(
    `${instanceUrl}/checkAccount/${credentials.apiTokenInstance}`,
    { phoneNumber },
  );

  return response.data;
};

export const receiveNotification = async (
  credentials: Credentials,
  signal?: AbortSignal,
) => {
  const instanceUrl = getInstanceUrl(credentials);
  const response = await axios.get<IncomingNotification | null>(
    `${instanceUrl}/receiveNotification/${credentials.apiTokenInstance}`,
    { params: { receiveTimeout: 5 }, signal },
  );

  return response.data;
};

export const deleteNotification = async (
  credentials: Credentials,
  receiptId: number,
) => {
  const instanceUrl = getInstanceUrl(credentials);
  await axios.delete(
    `${instanceUrl}/deleteNotification/${credentials.apiTokenInstance}/${receiptId}`,
  );
};
