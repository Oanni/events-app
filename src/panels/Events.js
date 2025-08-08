import React, { useState, useEffect } from 'react';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  Div,
  Search,
  ScreenSpinner,
  Placeholder,
  Title,
  Text
} from '@vkontakte/vkui';
import { Icon28CalendarOutline } from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { eventsAPI, registrationsAPI, handleAPIError } from '../services/api';
import { EventCard } from '../components/EventCard';
import { Navigation } from '../components/Navigation';
import { PageTransition } from '../components/PageTransition';
import PropTypes from 'prop-types';

export const Events = ({ id, fetchedUser }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [isVisible, setIsVisible] = useState(false);
  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    loadEvents();
    // Анимация появления
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    if (!loading && events.length > 0) {
      filterEvents();
    }
  }, [events, searchQuery, loading]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Загружаем мероприятия...');
      const response = await eventsAPI.getAll();
      console.log('📋 Получен ответ:', response);
      console.log('📊 Данные мероприятий:', response);
      
      // Supabase возвращает массив напрямую, а не в response.data
      // Сортируем по дате (ближайшие сначала)
      const sortedEvents = response.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sortedEvents);
      setFilteredEvents(sortedEvents);
      console.log('✅ Мероприятия установлены в состояние:', sortedEvents);
    } catch (error) {
      console.error('❌ Ошибка при загрузке мероприятий:', error);
      const errorMessage = handleAPIError(error);
      // Можно добавить snackbar для показа ошибки
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    // Проверяем, что searchQuery является строкой
    const query = typeof searchQuery === 'string' ? searchQuery : '';
    
    if (!query.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleEventPress = (event) => {
    routeNavigator.push(`/event/${event.id}`);
  };

  const handleRegisterPress = async (event) => {
    if (fetchedUser) {
      try {
        const response = await registrationsAPI.checkRegistration(event.id, fetchedUser.id);
        // Supabase возвращает массив, проверяем есть ли записи
        const isRegistered = response && response.length > 0;
        
        if (isRegistered) {
          // Отменить регистрацию
          routeNavigator.push(`/register/${event.id}?action=cancel`);
        } else {
          // Записаться на мероприятие
          routeNavigator.push(`/register/${event.id}`);
        }
      } catch (error) {
        console.error('Ошибка при проверке регистрации:', error);
        // Если не удалось проверить, просто переходим к регистрации
        routeNavigator.push(`/register/${event.id}`);
      }
    } else {
      // Если пользователь не авторизован, показываем сообщение
      console.log('Пользователь не авторизован');
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const renderEvents = () => {
    if (loading) {
      return (
        <Div style={{ textAlign: 'center', padding: '40px 0' }}>
          <ScreenSpinner size="large" />
        </Div>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <Placeholder
          icon={<Icon28CalendarOutline width={56} height={56} />}
          header="Мероприятия не найдены"
        >
          {searchQuery ? 
            'Попробуйте изменить поисковый запрос' : 
            'Пока нет доступных мероприятий'
          }
        </Placeholder>
      );
    }

    return (
      <PageTransition isVisible={isVisible}>
        <div style={{ 
          display: 'grid', 
          gap: '16px',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              style={{
                animation: `slideIn 0.4s ease-out ${index * 0.1}s both`,
                opacity: 0,
                transform: 'translateY(20px)',
              }}
            >
              <EventCard
                event={event}
                onPress={handleEventPress}
                onRegisterPress={handleRegisterPress}
                fetchedUser={fetchedUser}
              />
            </div>
          ))}
        </div>
      </PageTransition>
    );
  };

  return (
    <Panel id={id} style={{ backgroundColor: '#000000' }}>
      <PanelHeader style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
        Мероприятия
      </PanelHeader>
      
      <Group style={{ backgroundColor: '#000000' }}>
        <Div style={{ padding: '16px' }}>
          <Search
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск мероприятий..."
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #333',
              color: '#FFFFFF',
              marginBottom: '16px',
            }}
          />
        </Div>
        
        <Div style={{ padding: '0 16px 16px' }}>
          {renderEvents()}
        </Div>
      </Group>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </Panel>
  );
};

Events.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo_200: PropTypes.string,
  }),
}; 