const { query } = require('../config/database');

class Registration {
  // Получить все регистрации
  static async getAll() {
    const sql = `
      SELECT r.*, e.title as event_title, e.date as event_date, e.location as event_location,
             u.first_name, u.last_name, u.photo_200
      FROM registrations r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.registered_at DESC
    `;
    return await query(sql);
  }

  // Получить регистрацию по ID
  static async getById(id) {
    const sql = `
      SELECT r.*, e.title as event_title, e.date as event_date, e.location as event_location,
             u.first_name, u.last_name, u.photo_200
      FROM registrations r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `;
    const registrations = await query(sql, [id]);
    return registrations[0] || null;
  }

  // Создать новую регистрацию
  static async create(registrationData) {
    const sql = `
      INSERT INTO registrations (event_id, user_id, full_name, birth_date, institute, academic_group)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      registrationData.event_id,
      registrationData.user_id,
      registrationData.full_name,
      registrationData.birth_date,
      registrationData.institute,
      registrationData.academic_group
    ]);
    
    // Возвращаем созданную регистрацию
    return await this.getById(result.insertId);
  }

  // Удалить регистрацию
  static async delete(id) {
    const sql = 'DELETE FROM registrations WHERE id = ?';
    return await query(sql, [id]);
  }

  // Получить регистрации пользователя
  static async getByUserId(userId) {
    const sql = `
      SELECT r.*, e.title as event_title, e.date as event_date, e.location as event_location,
             e.description as event_description, e.vk_link as event_vk_link
      FROM registrations r
      LEFT JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ?
      ORDER BY e.date ASC
    `;
    return await query(sql, [userId]);
  }

  // Получить регистрации на мероприятие
  static async getByEventId(eventId) {
    const sql = `
      SELECT r.*, u.first_name, u.last_name, u.photo_200
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
      ORDER BY r.registered_at ASC
    `;
    return await query(sql, [eventId]);
  }

  // Проверить, зарегистрирован ли пользователь на мероприятие
  static async isUserRegistered(eventId, userId) {
    const sql = 'SELECT id FROM registrations WHERE event_id = ? AND user_id = ?';
    const registrations = await query(sql, [eventId, userId]);
    return registrations.length > 0;
  }

  // Получить количество регистраций на мероприятие
  static async getCountByEventId(eventId) {
    const sql = 'SELECT COUNT(*) as count FROM registrations WHERE event_id = ?';
    const result = await query(sql, [eventId]);
    return result[0].count;
  }

  // Отменить регистрацию пользователя на мероприятие
  static async cancelRegistration(eventId, userId) {
    const sql = 'DELETE FROM registrations WHERE event_id = ? AND user_id = ?';
    return await query(sql, [eventId, userId]);
  }

  // Получить статистику регистраций
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_registrations,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT event_id) as events_with_registrations
      FROM registrations
    `;
    const result = await query(sql);
    return result[0];
  }
}

module.exports = Registration;
