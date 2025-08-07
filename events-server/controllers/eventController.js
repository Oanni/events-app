const Event = require('../models/Event');

// Получить все мероприятия
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll();
    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении мероприятий',
      message: error.message
    });
  }
};

// Получить мероприятие по ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.getById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Мероприятие не найдено'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении мероприятия',
      message: error.message
    });
  }
};

// Создать новое мероприятие
const createEvent = async (req, res) => {
  try {
    const { title, location, date, description, vk_link } = req.body;
    const created_by = req.user?.id; // Будет из middleware аутентификации
    
    // Валидация
    if (!title || !location || !date || !description) {
      return res.status(400).json({
        success: false,
        error: 'Не все обязательные поля заполнены'
      });
    }
    
    // Проверяем, что дата в будущем
    const eventDate = new Date(date);
    const now = new Date();
    if (eventDate <= now) {
      return res.status(400).json({
        success: false,
        error: 'Дата мероприятия должна быть в будущем'
      });
    }
    
    const eventData = {
      title: title.trim(),
      location: location.trim(),
      date: eventDate.toISOString(),
      description: description.trim(),
      vk_link: vk_link?.trim() || null,
      created_by: created_by || 1 // Временно используем ID 1 для тестирования
    };
    
    const newEvent = await Event.create(eventData);
    
    res.status(201).json({
      success: true,
      data: newEvent,
      message: 'Мероприятие успешно создано'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при создании мероприятия',
      message: error.message
    });
  }
};

// Обновить мероприятие
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, date, description, vk_link } = req.body;
    
    // Проверяем существование мероприятия
    const existingEvent = await Event.getById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: 'Мероприятие не найдено'
      });
    }
    
    // Валидация
    if (!title || !location || !date || !description) {
      return res.status(400).json({
        success: false,
        error: 'Не все обязательные поля заполнены'
      });
    }
    
    const eventData = {
      title: title.trim(),
      location: location.trim(),
      date: new Date(date).toISOString(),
      description: description.trim(),
      vk_link: vk_link?.trim() || null
    };
    
    const updatedEvent = await Event.update(id, eventData);
    
    res.json({
      success: true,
      data: updatedEvent,
      message: 'Мероприятие успешно обновлено'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при обновлении мероприятия',
      message: error.message
    });
  }
};

// Удалить мероприятие
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверяем существование мероприятия
    const existingEvent = await Event.getById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: 'Мероприятие не найдено'
      });
    }
    
    await Event.delete(id);
    
    res.json({
      success: true,
      message: 'Мероприятие успешно удалено'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при удалении мероприятия',
      message: error.message
    });
  }
};

// Поиск мероприятий
const searchEvents = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Поисковый запрос должен содержать минимум 2 символа'
      });
    }
    
    const events = await Event.search(q.trim());
    
    res.json({
      success: true,
      data: events,
      count: events.length,
      searchTerm: q.trim()
    });
  } catch (error) {
    console.error('Error searching events:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при поиске мероприятий',
      message: error.message
    });
  }
};

// Получить мероприятия пользователя
const getUserEvents = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Временно используем ID 1 для тестирования
    const events = await Event.getByUserId(userId);
    
    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Error getting user events:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении мероприятий пользователя',
      message: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
  getUserEvents
};
