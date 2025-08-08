-- Полная настройка системы профилей пользователей
-- Выполните этот скрипт в Supabase SQL Editor

-- 1. Создаем таблицу users (если не существует)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    institute VARCHAR(100) NOT NULL,
    academic_group VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Упрощаем таблицу registrations - убираем лишние поля
ALTER TABLE registrations DROP COLUMN IF EXISTS full_name;
ALTER TABLE registrations DROP COLUMN IF EXISTS birth_date;
ALTER TABLE registrations DROP COLUMN IF EXISTS institute;
ALTER TABLE registrations DROP COLUMN IF EXISTS academic_group;

-- 3. Добавляем внешний ключ на users в registrations
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS user_profile_id BIGINT REFERENCES users(id) ON DELETE CASCADE;

-- 4. Добавляем комментарии
COMMENT ON TABLE users IS 'Профили пользователей с их данными';
COMMENT ON COLUMN users.full_name IS 'Полное имя пользователя';
COMMENT ON COLUMN users.birth_date IS 'Дата рождения пользователя';
COMMENT ON COLUMN users.institute IS 'Институт пользователя';
COMMENT ON COLUMN users.academic_group IS 'Академическая группа пользователя';

COMMENT ON COLUMN registrations.user_profile_id IS 'Ссылка на профиль пользователя';

-- 5. Включаем RLS для users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. Создаем политики для users
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON users
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own profile" ON users
FOR DELETE USING (true);

-- 7. Обновляем политики для registrations
DROP POLICY IF EXISTS "Users can view registrations" ON registrations;
DROP POLICY IF EXISTS "Users can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Users can update registrations" ON registrations;
DROP POLICY IF EXISTS "Users can delete registrations" ON registrations;
DROP POLICY IF EXISTS "Users can view registrations with institute" ON registrations;
DROP POLICY IF EXISTS "Users can insert registrations with institute" ON registrations;
DROP POLICY IF EXISTS "Users can update registrations with institute" ON registrations;
DROP POLICY IF EXISTS "Users can delete registrations with institute" ON registrations;

CREATE POLICY "Users can view registrations" ON registrations
FOR SELECT USING (true);

CREATE POLICY "Users can insert registrations" ON registrations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update registrations" ON registrations
FOR UPDATE USING (true);

CREATE POLICY "Users can delete registrations" ON registrations
FOR DELETE USING (true);

-- 8. Создаем индексы
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_profile_id ON registrations(user_profile_id);

-- 9. Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Триггер для автоматического обновления updated_at в users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- 11. Показываем финальную структуру таблиц
SELECT 'users' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

SELECT 'registrations' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
