// API Configuration
const getApiBaseUrl = () => {
  // Check if we're in production (Vercel)
  if (window.location.hostname.includes('vercel.app')) {
    // For now, use a placeholder - will be updated with Supabase URL
    return 'https://your-supabase-project.supabase.co/rest/v1';
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
      // Only add Supabase headers if we're using Supabase
      ...(window.location.hostname.includes('vercel.app') && {
        'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY || ''}`
      })
    },
    ...options
  };

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API response:`, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest('/events'),
  getById: (id) => apiRequest(`/events/${id}`),
  create: (eventData) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  }),
  update: (id, eventData) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  }),
  delete: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE'
  }),
  getMyEvents: () => apiRequest('/events/my'),
  search: (query) => apiRequest(`/events/search?q=${encodeURIComponent(query)}`)
};

// Registrations API
export const registrationsAPI = {
  getAll: () => apiRequest('/registrations'),
  getById: (id) => apiRequest(`/registrations/${id}`),
  create: (registrationData) => apiRequest('/registrations', {
    method: 'POST',
    body: JSON.stringify(registrationData)
  }),
  delete: (id) => apiRequest(`/registrations/${id}`, {
    method: 'DELETE'
  }),
  getMyRegistrations: () => apiRequest('/registrations/my'),
  getByEvent: (eventId) => apiRequest(`/registrations/event/${eventId}`),
  checkRegistration: (eventId) => apiRequest(`/registrations/check/${eventId}`),
  cancelRegistration: (eventId) => apiRequest(`/registrations/cancel/${eventId}`, {
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
