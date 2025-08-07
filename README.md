# Events App - VK Mini App

Приложение для создания и управления мероприятиями, разработанное как VK Mini App с React.js фронтендом и Supabase бэкендом.

## 🚀 Технологии

- **Frontend**: React.js, VKUI, Vite
- **Backend**: Supabase (PostgreSQL + REST API)
- **Hosting**: Vercel
- **Database**: Supabase PostgreSQL
- **Authentication**: VK OAuth

## 📋 Функциональность

- ✅ Создание и управление мероприятиями
- ✅ Регистрация на мероприятия
- ✅ Просмотр списка мероприятий
- ✅ Поиск мероприятий
- ✅ Управление своими мероприятиями
- ✅ Просмотр регистраций
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ Интеграция с VK API

## 🛠️ Локальная разработка

### Требования
- Node.js 16+
- npm или yarn

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Oanni/events-app.git
cd events-app
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `env.example`:
```bash
cp env.example .env
```

4. Настройте переменные окружения в `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=https://your-project-id.supabase.co/rest/v1
```

5. Запустите проект:
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:10888

## 🚀 Деплой на Vercel

### 1. Подготовка Supabase

1. Создайте аккаунт на [Supabase](https://supabase.com)
2. Создайте новый проект
3. В настройках проекта найдите URL и anon key
4. Создайте таблицы в SQL Editor:

```sql
-- Создание таблицы пользователей
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vk_id INTEGER UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  photo_100 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы мероприятий
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_participants INTEGER,
  created_by INTEGER NOT NULL,
  vk_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы регистраций
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Включение Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Политики для чтения (публичный доступ)
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Registrations are viewable by everyone" ON registrations FOR SELECT USING (true);

-- Политики для записи (только авторизованные пользователи)
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (created_by = current_setting('request.jwt.claims', true)::json->>'vk_id');
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (created_by = current_setting('request.jwt.claims', true)::json->>'vk_id');

CREATE POLICY "Users can register for events" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can cancel their registrations" ON registrations FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'vk_id');
```

### 2. Деплой на Vercel

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в Vercel:
```bash
vercel login
```

3. Деплой проекта:
```bash
vercel
```

4. Настройте переменные окружения в Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`

### 3. Настройка VK Mini App

1. В настройках VK Mini App укажите URL вашего Vercel деплоя
2. Настройте CORS в Supabase для домена вашего приложения

## 📁 Структура проекта

```
├── src/
│   ├── components/          # React компоненты
│   ├── panels/             # Панели приложения
│   ├── services/           # API сервисы
│   ├── styles/             # CSS стили
│   └── utils/              # Утилиты
├── events-server/          # Локальный сервер (для разработки)
├── public/                 # Статические файлы
├── vercel.json            # Конфигурация Vercel
└── env.example            # Пример переменных окружения
```

## 🔧 API Endpoints

Приложение использует Supabase REST API:

- `GET /events` - Получить все мероприятия
- `POST /events` - Создать мероприятие
- `GET /events?id=eq.{id}` - Получить мероприятие по ID
- `PATCH /events?id=eq.{id}` - Обновить мероприятие
- `DELETE /events?id=eq.{id}` - Удалить мероприятие
- `GET /registrations` - Получить все регистрации
- `POST /registrations` - Создать регистрацию
- `DELETE /registrations?event_id=eq.{eventId}&user_id=eq.{userId}` - Отменить регистрацию

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License

## 👨‍💻 Автор

Oanni - [GitHub](https://github.com/Oanni)
