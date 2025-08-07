// Определяем базовый URL API в зависимости от окружения
const getApiBaseUrl = () => {
  // Если мы в VK туннеле, используем HTTPS сервер
  if (window.location.hostname.includes('tunnel.vk-apps.com')) {
    return 'https://localhost:3443/api';
  }
  // Для локальной разработки
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Общая функция для HTTP запросов
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('Making API request to:', url);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API Error for', url, ':', error);
    
    // Проверяем тип ошибки
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Не удается подключиться к серверу. Проверьте, что сервер запущен на http://localhost:3001');
    }
    
    throw error;
  }
};

// API для мероприятий
export const eventsAPI = {
  // Получить все мероприятия
  getAll: () => apiRequest('/events'),

  // Получить мероприятие по ID
  getById: (id) => apiRequest(`/events/${id}`),

  // Создать новое мероприятие
  create: (eventData) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),

  // Обновить мероприятие
  update: (id, eventData) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),

  // Удалить мероприятие
  delete: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE',
  }),

  // Поиск мероприятий
  search: (query) => apiRequest(`/events/search?q=${encodeURIComponent(query)}`),

  // Получить мероприятия пользователя
  getMyEvents: () => apiRequest('/events/my'),
};

// API для регистраций
export const registrationsAPI = {
  // Получить все регистрации
  getAll: () => apiRequest('/registrations'),

  // Получить регистрацию по ID
  getById: (id) => apiRequest(`/registrations/${id}`),

  // Создать новую регистрацию
  create: (registrationData) => apiRequest('/registrations', {
    method: 'POST',
    body: JSON.stringify(registrationData),
  }),

  // Удалить регистрацию
  delete: (id) => apiRequest(`/registrations/${id}`, {
    method: 'DELETE',
  }),

  // Получить регистрации пользователя
  getMyRegistrations: () => apiRequest('/registrations/my'),

  // Получить регистрации на мероприятие
  getByEvent: (eventId) => apiRequest(`/registrations/event/${eventId}`),

  // Проверить регистрацию пользователя на мероприятие
  checkRegistration: (eventId) => apiRequest(`/registrations/check/${eventId}`),

  // Отменить регистрацию на мероприятие
  cancelRegistration: (eventId) => apiRequest(`/registrations/cancel/${eventId}`, {
    method: 'DELETE',
  }),

  // Получить статистику регистраций
  getStats: () => apiRequest('/registrations/stats'),
};

// Утилиты для работы с датами
export const dateUtils = {
  // Форматировать дату для отображения
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Проверить, прошло ли мероприятие
  isEventPassed: (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate <= now;
  },

  // Получить относительное время (через 2 дня, через неделю и т.д.)
  getRelativeTime: (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Прошло';
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    if (diffDays < 7) return `Через ${diffDays} дня`;
    if (diffDays < 30) return `Через ${Math.ceil(diffDays / 7)} недель`;
    return `Через ${Math.ceil(diffDays / 30)} месяцев`;
  },
};

// Обработка ошибок
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  // Показываем пользователю понятное сообщение об ошибке
  const errorMessage = error.message || 'Произошла ошибка при загрузке данных';
  
  // Здесь можно добавить показ уведомления пользователю
  // Например, через snackbar или toast
  return errorMessage;
};
