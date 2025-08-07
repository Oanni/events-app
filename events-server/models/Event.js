const { query } = require('../config/database');

class Event {
  // Получить все мероприятия
  static async getAll() {
    const sql = `
      SELECT e.*, u.first_name, u.last_name, u.photo_200 as creator_photo,
             COUNT(r.id) as registrations_count
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY e.date ASC
    `;
    return await query(sql);
  }

  // Получить мероприятие по ID
  static async getById(id) {
    const sql = `
      SELECT e.*, u.first_name, u.last_name, u.photo_200 as creator_photo
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = ?
    `;
    const events = await query(sql, [id]);
    return events[0] || null;
  }

  // Создать новое мероприятие
  static async create(eventData) {
    const sql = `
      INSERT INTO events (title, location, date, description, vk_link, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      eventData.title,
      eventData.location,
      eventData.date,
      eventData.description,
      eventData.vk_link || null,
      eventData.created_by
    ]);
    
    // Возвращаем созданное мероприятие
    return await this.getById(result.insertId);
  }

  // Обновить мероприятие
  static async update(id, eventData) {
    const sql = `
      UPDATE events 
      SET title = ?, location = ?, date = ?, description = ?, vk_link = ?
      WHERE id = ?
    `;
    await query(sql, [
      eventData.title,
      eventData.location,
      eventData.date,
      eventData.description,
      eventData.vk_link || null,
      id
    ]);
    
    return await this.getById(id);
  }

  // Удалить мероприятие
  static async delete(id) {
    const sql = 'DELETE FROM events WHERE id = ?';
    return await query(sql, [id]);
  }

  // Получить мероприятия пользователя
  static async getByUserId(userId) {
    const sql = `
      SELECT e.*, COUNT(r.id) as registrations_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.created_by = ?
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `;
    return await query(sql, [userId]);
  }

  // Поиск мероприятий
  static async search(searchTerm) {
    const sql = `
      SELECT e.*, u.first_name, u.last_name, u.photo_200 as creator_photo,
             COUNT(r.id) as registrations_count
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?
      GROUP BY e.id
      ORDER BY e.date ASC
    `;
    const searchPattern = `%${searchTerm}%`;
    return await query(sql, [searchPattern, searchPattern, searchPattern]);
  }
}

module.exports = Event;
