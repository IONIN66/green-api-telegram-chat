import { useState, type FC } from "react";
import {
  Alert,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconBrandTelegram, IconInfoCircle } from "@tabler/icons-react";
import { useChatStore } from "@/entities/chat/model/chat-store";
import styles from "./credentials-form.module.css";

const DEFAULT_API_URL = "https://api.green-api.com";

interface ICredentialsFormProps {
  children?: never;
}

export const CredentialsForm: FC<ICredentialsFormProps> = () => {
  const setCredentials = useChatStore((state) => state.setCredentials);
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const canSubmit = Boolean(idInstance.trim() && apiTokenInstance.trim());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setCredentials({
      apiUrl: DEFAULT_API_URL,
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  };

  return (
    <Center component="main" mih="100vh" p="xl" className={styles.page}>
      <Paper w="100%" maw={440} radius="xl" p="xl" shadow="xl">
        <Center>
          <ThemeIcon
            size={64}
            radius="xl"
            variant="gradient"
            gradient={{ from: "#50a8e7", to: "#2481cc", deg: 145 }}
            className={styles.logo}
          >
            <IconBrandTelegram size={34} stroke={1.7} />
          </ThemeIcon>
        </Center>
        <Title order={2} ta="center" mt="lg">
          GREEN-API Chat
        </Title>
        <Text c="dimmed" ta="center" mt={6} mb="xl">
          Подключите Telegram-инстанс, чтобы начать общение
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="ID Instance"
              placeholder="4100000000"
              value={idInstance}
              onChange={(event) => setIdInstance(event.currentTarget.value)}
              required
            />
            <PasswordInput
              label="API Token Instance"
              placeholder="Введите токен"
              value={apiTokenInstance}
              onChange={(event) => setApiTokenInstance(event.currentTarget.value)}
              required
            />
            <Alert
              color="blue"
              variant="light"
              icon={<IconInfoCircle size={18} />}
            >
              Данные хранятся только до закрытия вкладки браузера.
            </Alert>
            <Button type="submit" size="md" disabled={!canSubmit} fullWidth>
              Подключиться
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};
