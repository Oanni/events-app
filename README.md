# VK Mini App - Events Manager

Мини-приложение ВКонтакте для управления мероприятиями и регистрациями.

## 🚀 Возможности

- 📅 Создание и управление мероприятиями
- 👥 Регистрация на мероприятия
- 🔍 Поиск мероприятий
- 📱 Адаптивный дизайн для мобильных устройств
- 🌙 Темная тема
- 📊 Статистика регистраций

## 🛠 Технологии

### Frontend
- React 18
- VKUI (UI компоненты ВКонтакте)
- VK Bridge
- Vite (сборщик)

### Backend
- Node.js
- Express.js
- MySQL
- JWT аутентификация

## 📦 Установка и запуск

### Предварительные требования
- Node.js 18+
- MySQL 8.0+
- Git

### Установка зависимостей

```bash
# Установка зависимостей фронтенда
npm install

# Установка зависимостей бэкенда
cd events-server
npm install
```

### Настройка базы данных

1. Создайте базу данных MySQL
2. Скопируйте `.env.example` в `.env` в папке `events-server`
3. Настройте переменные окружения

```bash
cd events-server
cp .env.example .env
# Отредактируйте .env файл
```

### Запуск в режиме разработки

```bash
# Запуск фронтенда (в корневой папке)
npm run dev

# Запуск бэкенда (в папке events-server)
cd events-server
npm run dev
```

### Запуск туннеля для VK

```bash
npm run tunnel
```

## 🌐 Деплой

### VK Hosting
```bash
npm run build
npm run deploy
```

### Внешний хостинг
Проект готов для деплоя на:
- Vercel
- Render
- Heroku
- Railway

## 📁 Структура проекта

```
mini-app/
├── src/
│   ├── components/     # React компоненты
│   ├── panels/         # Панели приложения
│   ├── services/       # API сервисы
│   └── routes/         # Маршрутизация
├── events-server/      # Backend API
│   ├── config/         # Конфигурация БД
│   ├── routes/         # API маршруты
│   └── server.js       # Основной файл сервера
└── public/             # Статические файлы
```

## 🔧 API Endpoints

### Мероприятия
- `GET /api/events` - Получить все мероприятия
- `POST /api/events` - Создать мероприятие
- `GET /api/events/:id` - Получить мероприятие по ID
- `PUT /api/events/:id` - Обновить мероприятие
- `DELETE /api/events/:id` - Удалить мероприятие

### Регистрации
- `GET /api/registrations` - Получить все регистрации
- `POST /api/registrations` - Создать регистрацию
- `GET /api/registrations/my` - Получить регистрации пользователя
- `DELETE /api/registrations/:id` - Удалить регистрацию

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License

## 👨‍💻 Автор

Создано для VK Mini Apps
