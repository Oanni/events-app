// API Configuration
const getApiBaseUrl = () => {
  // Check if we're in production (Vercel)
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://qsrzonpgitnwgajdyppw.supabase.co/rest/v1';
  }
  
  // Check if we're in VK tunnel
  if (window.location.hostname.includes('tunnel.vk-apps.com')) {
    return 'https://localhost:3443/api';
  }
  
  // Local development
  return 'http://192.168.1.253:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Add Supabase headers for production
      ...(window.location.hostname.includes('vercel.app') && {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcnpvbnBnaXRud2dhamR5cHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzI2MzAsImV4cCI6MjA3MDE0ODYzMH0.htLrEKIdeWSYcbhNXcH7OnRHzeiOrG38EUYUMzGI15k',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcnpvbnBnaXRud2dhamR5cHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzI2MzAsImV4cCI6MjA3MDE0ODYzMH0.htLrEKIdeWSYcbhNXcH7OnRHzeiOrG38EUYUMzGI15k'
      })
    },
    ...options
  };

  try {
    console.log(`Making API request to: ${url}`);
    if (options.body) {
      console.log('Request body:', options.body);
    }
    
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      // Попробуем получить текст ошибки
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Не удалось получить текст ошибки';
      }
      
      console.error(`HTTP ${response.status} error:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    // Проверяем, есть ли контент в ответе
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Если нет JSON контента, возвращаем пустой массив для GET запросов
      if (defaultOptions.method === 'GET' || !defaultOptions.method) {
        console.log(`Empty response for GET request, returning empty array`);
        return [];
      }
      // Для других запросов возвращаем null
      return null;
    }
    
    const data = await response.json();
    console.log(`API response:`, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    
    // Если это ошибка парсинга JSON и это GET запрос, возвращаем пустой массив
    if (error.message.includes('Unexpected end of JSON input') && 
        (!options.method || options.method === 'GET')) {
      console.log(`JSON parse error for GET request, returning empty array`);
      return [];
    }
    
    throw error;
  }
};

// Events API
export const eventsAPI = {
  getAll: async () => {
    try {
      // Получаем все мероприятия
      const events = await apiRequest('/events');
      
      // Для каждого мероприятия получаем количество регистраций
      const eventsWithRegistrations = await Promise.all(
        events.map(async (event) => {
          try {
            const registrations = await apiRequest(`/registrations?event_id=eq.${event.id}`);
            return {
              ...event,
              registrations_count: registrations ? registrations.length : 0
            };
          } catch (error) {
            console.error(`Ошибка при получении регистраций для мероприятия ${event.id}:`, error);
            return {
              ...event,
              registrations_count: 0
            };
          }
        })
      );
      
      return eventsWithRegistrations;
    } catch (error) {
      console.error('Ошибка при получении мероприятий с регистрациями:', error);
      throw error;
    }
  },
  getById: (id) => apiRequest(`/events?id=eq.${id}`),
  create: async (eventData) => {
    try {
      const response = await apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      });
      
      // Если Supabase вернул данные с ID, возвращаем их
      if (response && response.id) {
        return response;
      }
      
      // Если ответ пустой, но запрос прошел успешно, 
      // нужно получить созданное мероприятие по данным
      if (response === null || response === undefined) {
        // Получаем последнее созданное мероприятие пользователя
        const userEvents = await apiRequest(`/events?created_by=eq.${eventData.created_by}&order=created_at.desc&limit=1`);
        if (userEvents && userEvents.length > 0) {
          return userEvents[0];
        }
      }
      
      // Fallback
      return response || { success: true };
    } catch (error) {
      throw error;
    }
  },
  update: (id, eventData) => apiRequest(`/events?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(eventData)
  }),
  delete: (id) => apiRequest(`/events?id=eq.${id}`, {
    method: 'DELETE'
  }),
  getMyEvents: async (userId) => {
    try {
      // Получаем мероприятия пользователя
      const events = await apiRequest(`/events?created_by=eq.${userId}`);
      
      // Для каждого мероприятия получаем количество регистраций
      const eventsWithRegistrations = await Promise.all(
        events.map(async (event) => {
          try {
            const registrations = await apiRequest(`/registrations?event_id=eq.${event.id}`);
            return {
              ...event,
              registrations_count: registrations ? registrations.length : 0
            };
          } catch (error) {
            console.error(`Ошибка при получении регистраций для мероприятия ${event.id}:`, error);
            return {
              ...event,
              registrations_count: 0
            };
          }
        })
      );
      
      return eventsWithRegistrations;
    } catch (error) {
      console.error('Ошибка при получении мероприятий пользователя с регистрациями:', error);
      throw error;
    }
  },
  search: (query) => apiRequest(`/events?title=ilike.*${query}*`)
};

// Registrations API
export const registrationsAPI = {
  getAll: () => apiRequest('/registrations'),
  getById: (id) => apiRequest(`/registrations?id=eq.${id}`),
  create: async (registrationData) => {
    try {
      const response = await apiRequest('/registrations', {
        method: 'POST',
        body: JSON.stringify(registrationData)
      });
      
      // Если Supabase вернул данные с ID, возвращаем их
      if (response && response.id) {
        return response;
      }
      
      // Если ответ пустой, но запрос прошел успешно, 
      // нужно получить созданную регистрацию по данным
      if (response === null || response === undefined) {
        // Получаем последнюю регистрацию пользователя на это мероприятие
        const userRegistrations = await apiRequest(`/registrations?event_id=eq.${registrationData.event_id}&user_id=eq.${registrationData.user_id}&order=created_at.desc&limit=1`);
        if (userRegistrations && userRegistrations.length > 0) {
          return userRegistrations[0];
        }
      }
      
      // Fallback
      return response || { success: true };
    } catch (error) {
      throw error;
    }
  },
  delete: (id) => apiRequest(`/registrations?id=eq.${id}`, {
    method: 'DELETE'
  }),
  getMyRegistrations: (userId) => apiRequest(`/registrations?user_id=eq.${userId}`),
  getByEvent: (eventId) => apiRequest(`/registrations?event_id=eq.${eventId}`),
  checkRegistration: (eventId, userId) => apiRequest(`/registrations?event_id=eq.${eventId}&user_id=eq.${userId}`),
  cancelRegistration: (eventId, userId) => apiRequest(`/registrations?event_id=eq.${eventId}&user_id=eq.${userId}`, {
    method: 'DELETE'
  })
};

// Date utilities
export const dateUtils = {
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  formatDateOnly: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  formatTimeOnly: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Error handling
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('Failed to fetch')) {
    return 'Ошибка подключения к серверу. Проверьте интернет-соединение.';
  }
  
  if (error.message.includes('HTTP error! status: 401')) {
    return 'Ошибка авторизации. Войдите в приложение заново.';
  }
  
  if (error.message.includes('HTTP error! status: 404')) {
    return 'Запрашиваемый ресурс не найден.';
  }
  
  if (error.message.includes('HTTP error! status: 500')) {
    return 'Ошибка сервера. Попробуйте позже.';
  }
  
  return 'Произошла ошибка. Попробуйте еще раз.';
};
