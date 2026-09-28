import { useEffect, useState, type FC } from "react";
import { Button, InputBase, Modal, Stack } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { IMaskInput } from "react-imask";
import { useChatStore } from "@/entities/chat/model/chat-store";
import { checkAccount } from "@/shared/api/green-api";
import type { GreenApiErrorResponse } from "@/shared/api/green-api.types";

interface ICreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateChatModal: FC<ICreateChatModalProps> = (props) => {
  const { isOpen, onClose } = props;
  const credentials = useChatStore((state) => state.credentials);
  const addChat = useChatStore((state) => state.addChat);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (!isOpen) setPhoneNumber("");
  }, [isOpen]);

  const createChatMutation = useMutation({
    mutationFn: async (normalizedPhoneNumber: string) => {
      if (!credentials) throw new Error("Нет данных подключения");
      return checkAccount(credentials, Number(normalizedPhoneNumber));
    },
    onSuccess: (account, normalizedPhoneNumber) => {
      if (!account.exist || !account.chatId) return;
      addChat(account.chatId, `+${normalizedPhoneNumber}`);
      onClose();
    },
  });

  const normalizedPhoneNumber = `7${phoneNumber.replace(/\D/g, "")}`;
  const isPhoneNumberValid = /^7\d{10}$/.test(normalizedPhoneNumber);

  const getErrorMessage = () => {
    if (!createChatMutation.isError) {
      if (createChatMutation.data?.status === false) {
        return (
          createChatMutation.data.reason ||
          createChatMutation.data.data?.reason ||
          "Не удалось проверить номер"
        );
      }

      if (createChatMutation.data && !createChatMutation.data.exist) {
        return "Telegram-аккаунт с таким номером не найден";
      }
      return null;
    }

    if (axios.isAxiosError<GreenApiErrorResponse>(createChatMutation.error)) {
      return (
        createChatMutation.error.response?.data?.reason ||
        createChatMutation.error.response?.data?.data?.reason ||
        "Не удалось проверить номер"
      );
    }

    return "Не удалось проверить номер";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isPhoneNumberValid) return;
    createChatMutation.mutate(normalizedPhoneNumber);
  };

  const handlePhoneAccept = (value: string) => {
    setPhoneNumber(value);
    createChatMutation.reset();
  };

  const preparePhoneNumber = (value: string, masked: { unmaskedValue: string }) => {
    if (masked.unmaskedValue) return value;
    return value.replace(/^\+?[78]/, "");
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Новый чат" centered>
      <form onSubmit={handleSubmit}>
        <Stack>
          <InputBase
            component={IMaskInput}
            label="Номер телефона получателя"
            description="Номер в формате +7 (999) 123-45-67"
            placeholder="999 123-45-67"
            leftSection="+7"
            mask="000 000-00-00"
            prepare={preparePhoneNumber}
            unmask
            value={phoneNumber}
            onAccept={handlePhoneAccept}
            error={getErrorMessage()}
            inputMode="tel"
            autoFocus
            required
          />
          <Button
            type="submit"
            disabled={!isPhoneNumberValid}
            loading={createChatMutation.isPending}
          >
            Создать чат
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
