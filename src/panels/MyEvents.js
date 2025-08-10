import React, { useState, useEffect } from 'react';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  Div,
  Placeholder,
  Title,
  Text,
  Button,
  Snackbar,
  ScreenSpinner
} from '@vkontakte/vkui';
import { Icon28UserOutline } from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { eventsAPI, handleAPIError } from '../services/api';
import { EventCard } from '../components/EventCard';
import { Navigation } from '../components/Navigation';
import { Confetti } from '../components/Confetti';
import { Achievement } from '../components/Achievement';
import { useAchievements } from '../hooks/useAchievements';
import PropTypes from 'prop-types';

export const MyEvents = ({ id, fetchedUser }) => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my_events');
  const [snackbar, setSnackbar] = useState(null);
  const routeNavigator = useRouteNavigator();
  
  // Система достижений
  const {
    showConfetti,
    achievement,
    checkCreationAchievements,
    handleConfettiComplete,
    handleAchievementClose
  } = useAchievements(fetchedUser?.id);

  useEffect(() => {
    loadMyEvents();
  }, [fetchedUser]);

  const loadMyEvents = async () => {
    if (!fetchedUser) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await eventsAPI.getMyEvents(fetchedUser.id);
      // Supabase возвращает массив напрямую, а не в response.data
      setMyEvents(response || []);
      
      // Проверяем достижения по количеству созданных мероприятий
      if (response && response.length > 0) {
        await checkCreationAchievements(response.length);
      }
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSnackbar({ text: errorMessage, mode: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (event) => {
    routeNavigator.push(`/event/${event.id}`);
  };

  const handleCreateEvent = () => {
    routeNavigator.push('/create-event');
  };

  const handleDeleteEvent = async (event) => {
    try {
      await eventsAPI.delete(event.id);
      await loadMyEvents(); // Перезагружаем список мероприятий
      setSnackbar({
        text: 'Мероприятие успешно удалено',
        mode: 'success'
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSnackbar({ text: errorMessage, mode: 'error' });
    }
  };

  const renderMyEvents = () => {
    // Показываем спиннер только если загрузка И события пустые
    if (loading && myEvents.length === 0) {
      return (
        <Div style={{ textAlign: 'center', padding: '40px 0' }}>
          <ScreenSpinner />
        </Div>
      );
    }

    if (!fetchedUser) {
      return (
        <Placeholder
          icon={<Icon28UserOutline style={{ color: '#0077FF' }} />}
          header="Необходима авторизация"
        >
          <Text style={{ color: '#AAAAAA' }}>
            Войдите в аккаунт, чтобы увидеть свои мероприятия
          </Text>
        </Placeholder>
      );
    }

    if (myEvents.length === 0) {
      return (
        <Placeholder
          icon={<Icon28UserOutline style={{ color: '#0077FF' }} />}
          header="У вас пока нет мероприятий"
        >
          <Text style={{ color: '#AAAAAA', marginBottom: '16px' }}>
            Создайте свое первое мероприятие и пригласите участников
          </Text>
          <Button 
            mode="primary" 
            onClick={handleCreateEvent}
            style={{
              backgroundColor: '#0077FF',
              border: 'none',
            }}
          >
            Создать мероприятие
          </Button>
        </Placeholder>
      );
    }

    return myEvents.map(event => (
      <EventCard
        key={event.id}
        event={event}
        onPress={handleEventPress}
        isRegistered={false}
        showRegisterButton={false}
        onDelete={handleDeleteEvent}
        isOwner={true}
      />
    ));
  };

  return (
    <Panel id={id} style={{ backgroundColor: '#000000' }}>
      <PanelHeader style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
        Мои мероприятия
      </PanelHeader>
      
      <Group style={{ backgroundColor: '#000000' }}>
        <Div style={{ padding: '0 16px 16px' }}>
          {renderMyEvents()}
        </Div>
      </Group>

      {snackbar && (
        <Snackbar
          onClose={() => setSnackbar(null)}
          duration={3000}
          mode={snackbar.mode}
        >
          {snackbar.text}
        </Snackbar>
      )}

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

MyEvents.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo_200: PropTypes.string,
  }),
}; 