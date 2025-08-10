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
import PropTypes from 'prop-types';

export const Events = ({ id, fetchedUser }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    loadEvents();
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
      
      // Проверяем, что response является массивом
      if (!Array.isArray(response)) {
        console.log('❌ Ответ не является массивом, устанавливаем пустой массив');
        setEvents([]);
        setFilteredEvents([]);
        return;
      }
      
      // Supabase возвращает массив напрямую, а не в response.data
      // Сортируем по дате (ближайшие сначала)
      const sortedEvents = response.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sortedEvents);
      setFilteredEvents(sortedEvents);
      console.log('✅ Мероприятия установлены в состояние:', sortedEvents);
    } catch (error) {
      console.error('❌ Ошибка при загрузке мероприятий:', error);
      const errorMessage = handleAPIError(error);
      // Устанавливаем пустой массив при ошибке
      setEvents([]);
      setFilteredEvents([]);
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
    }
  };

  const handleSearchChange = (value) => {
    // Убеждаемся, что value является строкой
    const stringValue = typeof value === 'string' ? value : (value?.target?.value || '');
    setSearchQuery(stringValue);
  };

  const renderEvents = () => {
    // Показываем спиннер только если загрузка И события пустые
    if (loading && events.length === 0) {
      return (
        <Div style={{ textAlign: 'center', padding: '40px 0' }}>
          <ScreenSpinner />
        </Div>
      );
    }

    // Если загрузка завершена, но filteredEvents еще пустой, показываем события напрямую
    const eventsToShow = filteredEvents.length > 0 ? filteredEvents : events;
    
    if (eventsToShow.length === 0) {
      return (
        <Placeholder
          icon={<Icon28CalendarOutline style={{ color: '#0077FF' }} />}
          header="Мероприятий не найдено"
        >
          {searchQuery ? (
            <Text style={{ color: '#AAAAAA' }}>
              Попробуйте изменить поисковый запрос
            </Text>
          ) : (
            <Text style={{ color: '#AAAAAA' }}>
              Пока нет доступных мероприятий
            </Text>
          )}
        </Placeholder>
      );
    }

    return eventsToShow
      .filter(event => event && event.id) // Фильтруем только валидные события
      .map(event => {
        console.log('🎯 Рендерим мероприятие:', event);
        
        return (
          <EventCard
            key={event.id}
            event={event}
            onPress={handleEventPress}
            isRegistered={false} // Пока отключаем проверку регистрации
            showRegisterButton={true}
          />
        );
      });
  };

  return (
    <Panel id={id} style={{ backgroundColor: '#000000' }}>
      <PanelHeader style={{ backgroundColor: '#000000', color: '#FFFFFF', borderBottom: '1px solid #333' }}>
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
            }}
          />
        </Div>
      </Group>

      <Group style={{ backgroundColor: '#000000' }}>
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