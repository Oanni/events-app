const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
  getUserEvents
} = require('../controllers/eventController');

// GET /api/events - получить все мероприятия
router.get('/', getAllEvents);

// GET /api/events/search?q=query - поиск мероприятий
router.get('/search', searchEvents);

// GET /api/events/my - получить мероприятия пользователя
router.get('/my', getUserEvents);

// GET /api/events/:id - получить мероприятие по ID
router.get('/:id', getEventById);

// POST /api/events - создать новое мероприятие
router.post('/', createEvent);

// PUT /api/events/:id - обновить мероприятие
router.put('/:id', updateEvent);

// DELETE /api/events/:id - удалить мероприятие
router.delete('/:id', deleteEvent);

module.exports = router;
