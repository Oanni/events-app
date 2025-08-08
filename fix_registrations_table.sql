-- Проверяем существующую структуру таблицы registrations
-- Если таблица не существует, создаем её
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    institute VARCHAR(100) NOT NULL,
    academic_group VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем недостающие поля, если они не существуют
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
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_registrations_updated_at ON registrations;
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
