const express = require('express');
const router = express.Router();
const {
  getAllRegistrations,
  getRegistrationById,
  createRegistration,
  deleteRegistration,
  getUserRegistrations,
  getEventRegistrations,
  checkUserRegistration,
  cancelUserRegistration,
  getRegistrationStats
} = require('../controllers/registrationController');

// GET /api/registrations - получить все регистрации
router.get('/', getAllRegistrations);

// GET /api/registrations/stats - получить статистику регистраций
router.get('/stats', getRegistrationStats);

// GET /api/registrations/my - получить регистрации пользователя
router.get('/my', getUserRegistrations);

// GET /api/registrations/event/:eventId - получить регистрации на мероприятие
router.get('/event/:eventId', getEventRegistrations);

// GET /api/registrations/check/:eventId - проверить регистрацию пользователя на мероприятие
router.get('/check/:eventId', checkUserRegistration);

// GET /api/registrations/:id - получить регистрацию по ID
router.get('/:id', getRegistrationById);

// POST /api/registrations - создать новую регистрацию
router.post('/', createRegistration);

// DELETE /api/registrations/:id - удалить регистрацию
router.delete('/:id', deleteRegistration);

// DELETE /api/registrations/cancel/:eventId - отменить регистрацию пользователя на мероприятие
router.delete('/cancel/:eventId', cancelUserRegistration);

module.exports = router;
