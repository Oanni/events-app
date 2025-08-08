-- Добавляем поле academic_group в таблицу registrations
ALTER TABLE registrations 
ADD COLUMN academic_group VARCHAR(50);

-- Добавляем комментарий к полю
COMMENT ON COLUMN registrations.academic_group IS 'Академическая группа студента';

-- Обновляем RLS политики для нового поля
-- Политика для SELECT
CREATE POLICY "Users can view registrations with academic_group" ON registrations
FOR SELECT USING (true);

-- Политика для INSERT
CREATE POLICY "Users can insert registrations with academic_group" ON registrations
FOR INSERT WITH CHECK (true);

-- Политика для UPDATE
CREATE POLICY "Users can update registrations with academic_group" ON registrations
FOR UPDATE USING (true);

-- Политика для DELETE
CREATE POLICY "Users can delete registrations with academic_group" ON registrations
FOR DELETE USING (true);
