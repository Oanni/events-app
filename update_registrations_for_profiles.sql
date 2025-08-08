-- Обновляем структуру таблицы registrations для работы с системой профилей
-- Убираем лишние поля, которые теперь хранятся в таблице users

-- 1. Удаляем поля, которые теперь хранятся в users
ALTER TABLE registrations DROP COLUMN IF EXISTS full_name;
ALTER TABLE registrations DROP COLUMN IF EXISTS birth_date;
ALTER TABLE registrations DROP COLUMN IF EXISTS institute;
ALTER TABLE registrations DROP COLUMN IF EXISTS academic_group;

-- 2. Добавляем поле user_profile_id для связи с users
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS user_profile_id BIGINT REFERENCES users(id) ON DELETE CASCADE;

-- 3. Добавляем комментарии
COMMENT ON COLUMN registrations.user_profile_id IS 'Ссылка на профиль пользователя';

-- 4. Включаем Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 5. Удаляем старые политики, если они есть
DROP POLICY IF EXISTS "Users can view registrations" ON registrations;
DROP POLICY IF EXISTS "Users can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Users can update registrations" ON registrations;
DROP POLICY IF EXISTS "Users can delete registrations" ON registrations;
DROP POLICY IF EXISTS "Users can view registrations with institute" ON registrations;
DROP POLICY IF EXISTS "Users can insert registrations with institute" ON registrations;
DROP POLICY IF EXISTS "Users can update registrations with institute" ON registrations;
DROP POLICY IF EXISTS "Users can delete registrations with institute" ON registrations;

-- 6. Создаем новые политики для упрощенной таблицы registrations
CREATE POLICY "Users can view registrations" ON registrations
FOR SELECT USING (true);

CREATE POLICY "Users can insert registrations" ON registrations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update registrations" ON registrations
FOR UPDATE USING (true);

CREATE POLICY "Users can delete registrations" ON registrations
FOR DELETE USING (true);

-- 7. Создаем индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_profile_id ON registrations(user_profile_id);

-- 8. Показываем финальную структуру таблиц
SELECT 'registrations' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

SELECT 'users' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
