// Утилиты для работы с данными мероприятий

// Институты для выбора
export const INSTITUTES = [
  { id: 'IT', name: 'ИТ' },
  { id: 'INMIN', name: 'ИНМИН' },
  { id: 'IKN', name: 'ИКН' },
  { id: 'EUPP', name: 'ЭУПП' },
  { id: 'GI', name: 'ГИ' },
  { id: 'IBO', name: 'ИБО' },
  { id: 'IBI', name: 'ИБИ' },
  { id: 'IFKI', name: 'ИФКИ' },
  { id: 'IR', name: 'ИР' },
];

// Локальное хранилище для мероприятий (в реальном приложении это будет API)
export const getEvents = () => {
  const events = localStorage.getItem('events');
  const parsedEvents = events ? JSON.parse(events) : [];
  
  // Возвращаем пустой массив - теперь используем API
  return parsedEvents;
};

export const saveEvents = (events) => {
  localStorage.setItem('events', JSON.stringify(events));
};

export const addEvent = (event) => {
  const events = getEvents();
  const newEvent = {
    ...event,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    createdBy: String(event.createdBy), // Преобразуем в строку для консистентности
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
};

export const getEventById = (id) => {
  const events = getEvents();
  return events.find(event => event.id === id);
};

export const updateEvent = (id, updates) => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    saveEvents(events);
    return events[index];
  }
  return null;
};

export const deleteEvent = (id) => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  saveEvents(filteredEvents);
  
  // Также удаляем все регистрации на это мероприятие
  const registrations = getRegistrations();
  const filteredRegistrations = registrations.filter(reg => reg.eventId !== id);
  saveRegistrations(filteredRegistrations);
};

// Локальное хранилище для регистраций
export const getRegistrations = () => {
  const registrations = localStorage.getItem('registrations');
  return registrations ? JSON.parse(registrations) : [];
};

export const saveRegistrations = (registrations) => {
  localStorage.setItem('registrations', JSON.stringify(registrations));
};

export const addRegistration = (registration) => {
  const registrations = getRegistrations();
  const newRegistration = {
    ...registration,
    id: Date.now().toString(),
    registeredAt: new Date().toISOString(),
  };
  registrations.push(newRegistration);
  saveRegistrations(registrations);
  return newRegistration;
};

export const getRegistrationsByEvent = (eventId) => {
  const registrations = getRegistrations();
  return registrations.filter(reg => reg.eventId === eventId);
};

export const getRegistrationsByUser = (userId) => {
  const registrations = getRegistrations();
  return registrations.filter(reg => reg.userId === userId);
};

export const isUserRegistered = (eventId, userId) => {
  const registrations = getRegistrations();
  return registrations.some(reg => reg.eventId === eventId && reg.userId === userId);
};

export const cancelRegistration = (eventId, userId) => {
  const registrations = getRegistrations();
  const filteredRegistrations = registrations.filter(
    reg => !(reg.eventId === eventId && reg.userId === userId)
  );
  saveRegistrations(filteredRegistrations);
};

// Утилиты для форматирования дат
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Валидация данных
export const validateEvent = (event) => {
  const errors = [];
  
  if (!event.title || event.title.trim().length < 3) {
    errors.push('Название должно содержать минимум 3 символа');
  }
  
  if (!event.location || event.location.trim().length < 3) {
    errors.push('Место проведения должно содержать минимум 3 символа');
  }
  
  if (!event.date) {
    errors.push('Выберите дату проведения');
  } else {
    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate < now) {
      errors.push('Дата проведения не может быть в прошлом');
    }
  }
  
  if (!event.description || event.description.trim().length < 10) {
    errors.push('Описание должно содержать минимум 10 символов');
  }
  
  return errors;
};

export const validateRegistration = (registration) => {
  const errors = [];
  
  if (!registration.fullName || registration.fullName.trim().length < 5) {
    errors.push('ФИО должно содержать минимум 5 символов');
  }
  
  if (!registration.birthDate) {
    errors.push('Выберите дату рождения');
  }
  
  if (!registration.institute) {
    errors.push('Выберите институт');
  }
  
  if (!registration.academicGroup || registration.academicGroup.trim().length < 2) {
    errors.push('Введите академическую группу');
  }
  
  return errors;
};
