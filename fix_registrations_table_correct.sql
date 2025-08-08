-- Исправляем таблицу registrations согласно реальной структуре
-- Удаляем неправильные поля и добавляем правильные

-- Удаляем поля, которых не должно быть
ALTER TABLE registrations DROP COLUMN IF EXISTS created_at;
ALTER TABLE registrations DROP COLUMN IF EXISTS updated_at;

-- Добавляем правильное поле registered_at, если его нет
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'registered_at') THEN
        ALTER TABLE registrations ADD COLUMN registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Убеждаемся, что все нужные поля существуют
DO $$ 
BEGIN
    -- Добавляем поле birth_date, если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'birth_date') THEN
        ALTER TABLE registrations ADD COLUMN birth_date DATE;
    END IF;
    
    -- Добавляем поле academic_group, если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'academic_group') THEN
        ALTER TABLE registrations ADD COLUMN academic_group VARCHAR(50);
    END IF;
    
    -- Добавляем поле institute, если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'institute') THEN
        ALTER TABLE registrations ADD COLUMN institute VARCHAR(100);
    END IF;
    
    -- Добавляем поле full_name, если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'registrations' AND column_name = 'full_name') THEN
        ALTER TABLE registrations ADD COLUMN full_name VARCHAR(255);
    END IF;
END $$;

-- Добавляем комментарии к полям
COMMENT ON COLUMN registrations.birth_date IS 'Дата рождения участника';
COMMENT ON COLUMN registrations.academic_group IS 'Академическая группа студента';
COMMENT ON COLUMN registrations.institute IS 'Институт студента';
COMMENT ON COLUMN registrations.full_name IS 'Полное имя участника';
COMMENT ON COLUMN registrations.registered_at IS 'Дата и время регистрации';

-- Включаем Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики, если они есть
DROP POLICY IF EXISTS "Users can view registrations" ON registrations;
DROP POLICY IF EXISTS "Users can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Users can update registrations" ON registrations;
DROP POLICY IF EXISTS "Users can delete registrations" ON registrations;
DROP POLICY IF EXISTS "Users can view registrations with academic_group" ON registrations;
DROP POLICY IF EXISTS "Users can insert registrations with academic_group" ON registrations;
DROP POLICY IF EXISTS "Users can update registrations with academic_group" ON registrations;
DROP POLICY IF EXISTS "Users can delete registrations with academic_group" ON registrations;

-- Создаем новые политики
CREATE POLICY "Users can view registrations" ON registrations
FOR SELECT USING (true);

CREATE POLICY "Users can insert registrations" ON registrations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update registrations" ON registrations
FOR UPDATE USING (true);

CREATE POLICY "Users can delete registrations" ON registrations
FOR DELETE USING (true);

-- Создаем индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_registered_at ON registrations(registered_at);

-- Показываем финальную структуру таблицы
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
