const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Получить все регистрации
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.getAll();
    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    console.error('Error getting registrations:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении регистраций',
      message: error.message
    });
  }
};

// Получить регистрацию по ID
const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.getById(id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Регистрация не найдена'
      });
    }
    
    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error getting registration:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении регистрации',
      message: error.message
    });
  }
};

// Создать новую регистрацию
const createRegistration = async (req, res) => {
  try {
    const { event_id, full_name, birth_date, institute, academic_group } = req.body;
    const user_id = req.user?.id || 1; // Временно используем ID 1 для тестирования
    
    // Валидация
    if (!event_id || !full_name || !birth_date || !institute || !academic_group) {
      return res.status(400).json({
        success: false,
        error: 'Не все обязательные поля заполнены'
      });
    }
    
    // Проверяем существование мероприятия
    const event = await Event.getById(event_id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Мероприятие не найдено'
      });
    }
    
    // Проверяем, что мероприятие еще не прошло
    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate <= now) {
      return res.status(400).json({
        success: false,
        error: 'Регистрация на прошедшие мероприятия невозможна'
      });
    }
    
    // Проверяем, не зарегистрирован ли уже пользователь
    const isRegistered = await Registration.isUserRegistered(event_id, user_id);
    if (isRegistered) {
      return res.status(400).json({
        success: false,
        error: 'Вы уже зарегистрированы на это мероприятие'
      });
    }
    
    const registrationData = {
      event_id: parseInt(event_id),
      user_id: user_id,
      full_name: full_name.trim(),
      birth_date: birth_date,
      institute: institute.trim(),
      academic_group: academic_group.trim()
    };
    
    const newRegistration = await Registration.create(registrationData);
    
    res.status(201).json({
      success: true,
      data: newRegistration,
      message: 'Регистрация успешно создана'
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при создании регистрации',
      message: error.message
    });
  }
};

// Удалить регистрацию
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверяем существование регистрации
    const existingRegistration = await Registration.getById(id);
    if (!existingRegistration) {
      return res.status(404).json({
        success: false,
        error: 'Регистрация не найдена'
      });
    }
    
    await Registration.delete(id);
    
    res.json({
      success: true,
      message: 'Регистрация успешно удалена'
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при удалении регистрации',
      message: error.message
    });
  }
};

// Получить регистрации пользователя
const getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Временно используем ID 1 для тестирования
    const registrations = await Registration.getByUserId(userId);
    
    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    console.error('Error getting user registrations:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении регистраций пользователя',
      message: error.message
    });
  }
};

// Получить регистрации на мероприятие
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.getByEventId(eventId);
    
    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    console.error('Error getting event registrations:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении регистраций на мероприятие',
      message: error.message
    });
  }
};

// Проверить регистрацию пользователя на мероприятие
const checkUserRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id || 1; // Временно используем ID 1 для тестирования
    
    const isRegistered = await Registration.isUserRegistered(eventId, userId);
    
    res.json({
      success: true,
      data: {
        event_id: parseInt(eventId),
        user_id: userId,
        is_registered: isRegistered
      }
    });
  } catch (error) {
    console.error('Error checking user registration:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при проверке регистрации',
      message: error.message
    });
  }
};

// Отменить регистрацию пользователя на мероприятие
const cancelUserRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id || 1; // Временно используем ID 1 для тестирования
    
    // Проверяем, зарегистрирован ли пользователь
    const isRegistered = await Registration.isUserRegistered(eventId, userId);
    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        error: 'Вы не зарегистрированы на это мероприятие'
      });
    }
    
    await Registration.cancelRegistration(eventId, userId);
    
    res.json({
      success: true,
      message: 'Регистрация успешно отменена'
    });
  } catch (error) {
    console.error('Error canceling registration:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при отмене регистрации',
      message: error.message
    });
  }
};

// Получить статистику регистраций
const getRegistrationStats = async (req, res) => {
  try {
    const stats = await Registration.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting registration stats:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении статистики регистраций',
      message: error.message
    });
  }
};

module.exports = {
  getAllRegistrations,
  getRegistrationById,
  createRegistration,
  deleteRegistration,
  getUserRegistrations,
  getEventRegistrations,
  checkUserRegistration,
  cancelUserRegistration,
  getRegistrationStats
};
