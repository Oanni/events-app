-- Добавляем поле institute в таблицу registrations
ALTER TABLE registrations 
ADD COLUMN institute VARCHAR(100);

-- Добавляем комментарий к полю
COMMENT ON COLUMN registrations.institute IS 'Институт студента';

-- Обновляем RLS политики для нового поля
-- Политика для SELECT
CREATE POLICY "Users can view registrations with institute" ON registrations
FOR SELECT USING (true);

-- Политика для INSERT
CREATE POLICY "Users can insert registrations with institute" ON registrations
FOR INSERT WITH CHECK (true);

-- Политика для UPDATE
CREATE POLICY "Users can update registrations with institute" ON registrations
FOR UPDATE USING (true);

-- Политика для DELETE
CREATE POLICY "Users can delete registrations with institute" ON registrations
FOR DELETE USING (true);

-- Показываем обновленную структуру таблицы
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
