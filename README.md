# GREEN-API Telegram Chat

Минималистичный React-клиент для отправки и получения текстовых сообщений Telegram через GREEN-API. Интерфейс адаптивный и визуально приближен к Telegram Web.

## Возможности

- подключение по `idInstance` и `apiTokenInstance`;
- создание чата по номеру телефона получателя;
- получение Telegram `chatId` методом `CheckAccount`;
- отправка текстовых сообщений;
- получение входящих сообщений через HTTP API (long polling);
- подтверждение обработки уведомлений методом `DeleteNotification`;
- защита от дублирования сообщений по `idMessage`;
- статусы отправки и обработка сетевых ошибок;
- адаптивный интерфейс в стиле Telegram;
- хранение чатов и учётных данных только в `sessionStorage`.

## Стек

- React 18.3;
- TypeScript 5.6;
- Vite 5.4;
- Mantine UI 7.17;
- TanStack Query 5;
- Zustand 4;
- Axios 1.7;
- React IMask 7.6;
- CSS Modules;
- pnpm 11.

Все версии зафиксированы в `package.json` и `pnpm-lock.yaml`.

## Архитектура

Проект организован по Feature-Sliced Design:

```text
src/
├── app/       # провайдеры и глобальные стили
├── pages/     # страница чата
├── widgets/   # боковая панель и окно диалога
├── features/  # подключение, создание чата, отправка и получение
├── entities/  # модели чата и сообщений
└── shared/    # API-клиент, типы и общие ресурсы
```

Типовая раскладка собрана из компонентов Mantine. Уникальные стили пузырей сообщений, фона и мобильной раскладки изолированы в CSS Modules рядом с компонентами.

## Подготовка GREEN-API

1. Создайте и авторизуйте Telegram-инстанс в [личном кабинете GREEN-API](https://console.green-api.com/).
2. В настройках инстанса оставьте `webhookUrl` пустым.
3. Включите получение уведомлений о входящих сообщениях (`incomingWebhook`).
4. Скопируйте `idInstance` и `apiTokenInstance` из карточки инстанса.

## Локальный запуск

Требуются Node.js 20+ и pnpm 11.5.1.

```bash
pnpm install
pnpm dev
```

Vite выведет адрес приложения в терминале, обычно `http://localhost:5173`.

`pnpm-workspace.yaml` явно разрешает install-скрипты только для `@swc/core` и `esbuild`. Они необходимы Vite и SWC для сборки проекта.

## Проверки и production-сборка

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

Готовая сборка появится в каталоге `dist`.

## Как пользоваться

1. Введите реквизиты Telegram-инстанса GREEN-API.
2. Нажмите «Новый чат» и укажите номер телефона получателя через маску `+7 (999) 123-45-67`.
3. Введите сообщение и нажмите кнопку отправки или Enter.
4. Входящие текстовые ответы появятся в чате автоматически.

Для переноса строки в сообщении используйте Shift + Enter.

## Ограничения

- Поддерживаются только текстовые сообщения.
- История и учётные данные хранятся в `sessionStorage` до закрытия вкладки.
- Это демонстрационный frontend-only проект. Токен передаётся браузером напрямую в GREEN-API. В production-приложении секреты и запросы следует вынести на backend/BFF.
- Telegram API GREEN-API находится в beta и может работать нестабильно.

## Документация API

- [SendMessage](https://green-api.com/telegram/docs/api/sending/SendMessage/)
- [Получение уведомлений через HTTP API](https://green-api.com/telegram/docs/api/receiving/technology-http-api/)
- [Формат входящего сообщения](https://green-api.com/telegram/docs/api/receiving/notifications-format/incoming-message/Webhook-IncomingMessageReceived/)
