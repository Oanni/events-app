import React, { useState, useEffect } from 'react';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  Div,
  Placeholder,
  Title,
  Text
} from '@vkontakte/vkui';
import { Icon28HeartCircleOutline } from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { registrationsAPI, eventsAPI, handleAPIError } from '../services/api';
import { EventCard } from '../components/EventCard';
import { Navigation } from '../components/Navigation';
import PropTypes from 'prop-types';

export const MyRegistrations = ({ id, fetchedUser }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('my_registrations');
  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    loadRegisteredEvents();
  }, [fetchedUser]);

  const loadRegisteredEvents = async () => {
    if (!fetchedUser) return;
    
    try {
      console.log('🔄 Загружаем регистрации пользователя...');
      const response = await registrationsAPI.getMyRegistrations();
      console.log('📋 Получен ответ:', response);
      console.log('📊 Данные регистраций:', response.data);
      
      // Получаем ID мероприятий из регистраций
      const eventIds = response.data.map(registration => registration.event_id);
      console.log('🎯 ID мероприятий:', eventIds);
      
      // Получаем полную информацию о мероприятиях
      const events = [];
      for (const eventId of eventIds) {
        try {
          const eventResponse = await eventsAPI.getById(eventId);
          if (eventResponse.data) {
            events.push(eventResponse.data);
          }
        } catch (error) {
          console.error(`Ошибка при получении мероприятия ${eventId}:`, error);
        }
      }
      
      // Сортируем по дате проведения (ближайшие сначала)
      const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
      setRegisteredEvents(sortedEvents);
      console.log('✅ Мероприятия установлены в состояние:', sortedEvents);
    } catch (error) {
      console.error('❌ Ошибка при загрузке регистраций:', error);
      const errorMessage = handleAPIError(error);
      // Можно добавить snackbar для показа ошибки
    }
  };

  const handleEventPress = (event) => {
    routeNavigator.push(`/event/${event.id}`);
  };

  const renderRegisteredEvents = () => {
    if (!fetchedUser) {
      return (
        <Placeholder
          icon={<Icon28HeartCircleOutline style={{ color: '#0077FF' }} />}
          header="Необходима авторизация"
        >
          <Text style={{ color: '#AAAAAA' }}>
            Войдите в аккаунт, чтобы увидеть свои регистрации
          </Text>
        </Placeholder>
      );
    }

    if (registeredEvents.length === 0) {
      return (
        <Placeholder
          icon={<Icon28HeartCircleOutline style={{ color: '#0077FF' }} />}
          header="Вы пока не записались ни на одно мероприятие"
        >
          <Text style={{ color: '#AAAAAA' }}>
            Найдите интересное мероприятие и запишитесь на него
          </Text>
        </Placeholder>
      );
    }

    return registeredEvents.map(event => {
      console.log('🎯 Рендерим зарегистрированное мероприятие:', event);
      
      return (
        <EventCard
          key={event.id}
          event={event}
          onPress={handleEventPress}
          isRegistered={true} // Показываем как зарегистрированное
          showRegisterButton={true}
        />
      );
    });
  };

  return (
    <Panel id={id} style={{ backgroundColor: '#000000' }}>
      <PanelHeader style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
        Туда я пойду!
      </PanelHeader>
      
      <Group style={{ backgroundColor: '#000000' }}>
        <Div style={{ padding: '0 16px 16px' }}>
          {renderRegisteredEvents()}
        </Div>
      </Group>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </Panel>
  );
};

MyRegistrations.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo_200: PropTypes.string,
  }),
}; 