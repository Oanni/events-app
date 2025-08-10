import React, { useState, useEffect } from 'react';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  Div,
  Placeholder,
  Title,
  Text,
  ScreenSpinner
} from '@vkontakte/vkui';
import { Icon28HeartCircleOutline } from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { registrationsAPI, eventsAPI, handleAPIError } from '../services/api';
import { EventCard } from '../components/EventCard';
import { Navigation } from '../components/Navigation';
import { Confetti } from '../components/Confetti';
import { Achievement } from '../components/Achievement';
import { useAchievements } from '../hooks/useAchievements';
import PropTypes from 'prop-types';

export const MyRegistrations = ({ id, fetchedUser }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my_registrations');
  const routeNavigator = useRouteNavigator();
  
  // Система достижений
  const {
    showConfetti,
    achievement,
    checkRegistrationAchievements,
    handleConfettiComplete,
    handleAchievementClose
  } = useAchievements(fetchedUser?.id);

  useEffect(() => {
    loadRegisteredEvents();
  }, [fetchedUser]);

  const loadRegisteredEvents = async () => {
    if (!fetchedUser) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Загружаем регистрации пользователя...');
      const response = await registrationsAPI.getMyRegistrations(fetchedUser.id);
      console.log('📋 Получен ответ:', response);
      console.log('📊 Данные регистраций:', response);
      
      // Supabase возвращает массив напрямую, а не в response.data
      // Получаем ID мероприятий из регистраций
      const eventIds = response.map(registration => registration.event_id);
      console.log('🎯 ID мероприятий:', eventIds);
      
      // Получаем полную информацию о мероприятиях с количеством регистраций
      const events = [];
      for (const eventId of eventIds) {
        try {
          const eventResponse = await eventsAPI.getById(eventId);
          // Supabase возвращает массив, берем первый элемент
          if (eventResponse && eventResponse.length > 0) {
            const event = eventResponse[0];
            
            // Получаем количество регистраций для этого мероприятия
            try {
              const registrationsResponse = await registrationsAPI.getByEvent(eventId);
              event.registrations_count = registrationsResponse ? registrationsResponse.length : 0;
            } catch (regError) {
              console.error(`Ошибка при получении регистраций для мероприятия ${eventId}:`, regError);
              event.registrations_count = 0;
            }
            
            events.push(event);
          }
        } catch (error) {
          console.error(`Ошибка при получении мероприятия ${eventId}:`, error);
        }
      }
      
      // Сортируем по дате проведения (ближайшие сначала)
      const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
      setRegisteredEvents(sortedEvents);
      console.log('✅ Мероприятия установлены в состояние:', sortedEvents);
      
      // Проверяем достижения по количеству регистраций
      if (response && response.length > 0) {
        await checkRegistrationAchievements(response.length);
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке регистраций:', error);
      const errorMessage = handleAPIError(error);
      // Можно добавить snackbar для показа ошибки
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (event) => {
    routeNavigator.push(`/event/${event.id}`);
  };

  const renderRegisteredEvents = () => {
    // Показываем спиннер только если загрузка И события пустые
    if (loading && registeredEvents.length === 0) {
      return (
        <Div style={{ textAlign: 'center', padding: '40px 0' }}>
          <ScreenSpinner />
        </Div>
      );
    }

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

    return registeredEvents
      .filter(event => event && event.id) // Фильтруем только валидные события
      .map(event => {
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

      {/* Компоненты геймификации */}
      <Confetti 
        isActive={showConfetti} 
        onComplete={handleConfettiComplete} 
      />
      <Achievement 
        isVisible={achievement.isVisible}
        message={achievement.message}
        onClose={handleAchievementClose}
      />

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