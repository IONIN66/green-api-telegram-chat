import type { FC } from "react";
import { CredentialsForm } from "@/features/instance-auth/ui/credentials-form";
import { ChatPage } from "@/pages/chat/ui/chat-page";
import { useChatStore } from "@/entities/chat/model/chat-store";

interface IAppProps {
  children?: never;
}

export const App: FC<IAppProps> = () => {
  const credentials = useChatStore((state) => state.credentials);

  if (!credentials) return <CredentialsForm />;
  return <ChatPage />;
};
