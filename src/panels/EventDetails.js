import React, { useState, useEffect } from 'react';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  Div,
  Title,
  Text,
  Button,
  Avatar,
  Cell,
  Badge,
  Snackbar,
  Header
} from '@vkontakte/vkui';
import { 
  Icon28CalendarOutline, 
  Icon28PlaceOutline, 
  Icon28UserOutline,
  Icon28LinkOutline,
  Icon28ArrowLeftOutline,
  Icon28DeleteOutline
} from '@vkontakte/icons';
import { useRouteNavigator, useParams } from '@vkontakte/vk-mini-apps-router';
import { eventsAPI, registrationsAPI, dateUtils, handleAPIError } from '../services/api';
import { Navigation } from '../components/Navigation';
import { Confetti } from '../components/Confetti';
import { Achievement } from '../components/Achievement';
import { useAchievements } from '../hooks/useAchievements';
import PropTypes from 'prop-types';

export const EventDetails = ({ id, fetchedUser }) => {
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isUserRegisteredForEvent, setIsUserRegisteredForEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const routeNavigator = useRouteNavigator();
  const { id: eventId } = useParams();
  
  // Система достижений
  const {
    showConfetti,
    achievement,
    checkRegistrationAchievements,
    handleConfettiComplete,
    handleAchievementClose
  } = useAchievements(fetchedUser?.id);

  useEffect(() => {
    loadEventDetails();
  }, [eventId, fetchedUser]);

  const loadEventDetails = async () => {
    if (!eventId) {
      console.error('eventId не определен');
      setSnackbar({
        text: 'Ошибка: ID мероприятия не найден',
        mode: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log('Загружаем детали мероприятия с ID:', eventId);
      
      // Загружаем мероприятие
      const eventResponse = await eventsAPI.getById(eventId);
      // Supabase возвращает массив, берем первый элемент
      if (!eventResponse || eventResponse.length === 0) {
        setEvent(null);
        setSnackbar({
          text: 'Мероприятие не найдено',
          mode: 'error'
        });
        return;
      }
      setEvent(eventResponse[0]);
      
      // Загружаем регистрации на мероприятие
      const registrationsResponse = await registrationsAPI.getByEvent(eventId);
      // Supabase возвращает массив напрямую
      setRegistrations(registrationsResponse || []);
      
      // Проверяем регистрацию пользователя
      if (fetchedUser) {
        const checkResponse = await registrationsAPI.checkRegistration(eventId, fetchedUser.id);
        // Supabase возвращает массив, проверяем есть ли записи
        setIsUserRegisteredForEvent(checkResponse && checkResponse.length > 0);
      }
    } catch (error) {
      console.error('Ошибка при загрузке деталей мероприятия:', error);
      const errorMessage = handleAPIError(error);
      setSnackbar({ text: errorMessage, mode: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (!fetchedUser) {
      setSnackbar({
        text: 'Необходима авторизация для регистрации',
        mode: 'error'
      });
      return;
    }

    routeNavigator.push(`/register/${eventId}`);
  };

  const handleCancelRegistration = async () => {
    if (!fetchedUser) return;

    try {
      await registrationsAPI.cancelRegistration(eventId, fetchedUser.id);
      setIsUserRegisteredForEvent(false);
      await loadEventDetails(); // Обновляем список регистраций
      
      setSnackbar({
        text: 'Регистрация отменена',
        mode: 'success'
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSnackbar({ text: errorMessage, mode: 'error' });
    }
  };

  const handleBack = () => {
    routeNavigator.push('/');
  };

  const handleDeleteEvent = async () => {
    if (!fetchedUser || String(event.created_by) !== String(fetchedUser.id)) {
      setSnackbar({
        text: 'У вас нет прав для удаления этого мероприятия',
        mode: 'error'
      });
      return;
    }

    try {
      await eventsAPI.delete(event.id);
      setSnackbar({
        text: 'Мероприятие успешно удалено',
        mode: 'success'
      });
      
      // Возвращаемся на главную через 2 секунды
      setTimeout(() => {
        routeNavigator.push('/');
      }, 2000);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSnackbar({ text: errorMessage, mode: 'error' });
    }
  };

  if (loading) {
    return (
      <Panel id={id} style={{ backgroundColor: '#000000' }}>
        <PanelHeader style={{ backgroundColor: '#000000', color: '#FFFFFF', borderBottom: '1px solid #333' }}>
          Загрузка...
        </PanelHeader>
        <Div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text style={{ color: '#FFFFFF' }}>Загрузка мероприятия...</Text>
        </Div>
      </Panel>
    );
  }

  if (!event) {
    return (
      <Panel id={id} style={{ backgroundColor: '#000000' }}>
        <PanelHeader style={{ backgroundColor: '#000000', color: '#FFFFFF', borderBottom: '1px solid #333' }}>
          Мероприятие не найдено
        </PanelHeader>
        <Div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text style={{ color: '#FFFFFF' }}>Мероприятие не найдено</Text>
        </Div>
      </Panel>
    );
  }

  return (
    <Panel id={id} style={{ backgroundColor: '#000000' }}>
      <PanelHeader 
        style={{ backgroundColor: '#000000', color: '#FFFFFF', borderBottom: '1px solid #333' }}
        left={
          <Button
            mode="tertiary"
            onClick={handleBack}
            style={{ color: '#FFFFFF' }}
          >
            <Icon28ArrowLeftOutline />
          </Button>
        }
      >
        {event.title}
      </PanelHeader>
      
      <Group style={{ backgroundColor: '#000000' }}>
        <Div style={{ padding: '16px' }}>
          <Title level="1" style={{ color: '#FFFFFF', marginBottom: '16px' }}>
            {event.title}
          </Title>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Icon28CalendarOutline style={{ color: '#0077FF', marginRight: '8px' }} />
            <Text style={{ color: '#CCCCCC' }}>
              {dateUtils.formatDate(event.date)}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Icon28PlaceOutline style={{ color: '#0077FF', marginRight: '8px' }} />
            <Text style={{ color: '#CCCCCC' }}>
              {event.location}
            </Text>
          </div>

          <Text style={{ color: '#AAAAAA', marginBottom: '24px', lineHeight: '1.6' }}>
            {event.description}
          </Text>

          {event.vk_link && (
            <div style={{ marginBottom: '24px' }}>
              <Button
                mode="secondary"
                before={<Icon28LinkOutline />}
                onClick={() => window.open(event.vk_link, '_blank')}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #0077FF',
                  color: '#0077FF',
                }}
              >
                Открыть в ВК
              </Button>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon28UserOutline style={{ color: '#0077FF', marginRight: '4px' }} />
              <Text style={{ color: '#888888' }}>
                {registrations.length} участников
              </Text>
            </div>

            {isUserRegisteredForEvent && (
              <Badge mode="prominent" style={{ backgroundColor: '#0077FF' }}>
                Вы записаны
              </Badge>
            )}
          </div>

          {fetchedUser && (
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {!isUserRegisteredForEvent ? (
                  <Button
                    mode="primary"
                    onClick={handleRegister}
                    style={{
                      flex: 1,
                      backgroundColor: '#0077FF',
                      border: 'none',
                    }}
                  >
                    Записаться
                  </Button>
                ) : (
                  <Button
                    mode="secondary"
                    onClick={handleCancelRegistration}
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      border: '1px solid #FF3B30',
                      color: '#FF3B30',
                    }}
                  >
                    Отменить регистрацию
                  </Button>
                )}
              </div>
              
              {/* Кнопка удаления для создателя мероприятия */}
              {fetchedUser && String(event.created_by) === String(fetchedUser.id) && (
                <Button
                  mode="secondary"
                  onClick={handleDeleteEvent}
                  before={<Icon28DeleteOutline />}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #FF3B30',
                    color: '#FF3B30',
                  }}
                >
                  Удалить мероприятие
                </Button>
              )}
            </div>
          )}
        </Div>
      </Group>

      {registrations.length > 0 && (
        <Group style={{ backgroundColor: '#000000' }}>
          <Header style={{ color: '#FFFFFF' }}>
            Участники ({registrations.length})
          </Header>
          <Div style={{ padding: '0 16px 16px' }}>
            {registrations.map((registration, index) => {
              // Создаем инициалы из ФИО
              const initials = registration.full_name
                .split(' ')
                .map(name => name.charAt(0))
                .join('')
                .toUpperCase();
              
              return (
                <Cell
                  key={registration.id}
                  before={
                    <Avatar 
                      size={32} 
                      src={registration.photo}
                      
                    >
                      {initials}
                    </Avatar>
                  }
                  style={{
                    backgroundColor: '#1A1A1A',
                    marginBottom: '8px',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>
                      {registration.full_name}
                    </Text>
                    <Text style={{ color: '#888888', fontSize: '14px' }}>
                      {registration.institute} • {registration.academic_group}
                    </Text>
                    {registration.birth_date && (
                      <Text style={{ color: '#666666', fontSize: '12px' }}>
                        {new Date(registration.birth_date).toLocaleDateString('ru-RU')}
                      </Text>
                    )}
                  </div>
                </Cell>
              );
            })}
          </Div>
        </Group>
      )}

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

EventDetails.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo_200: PropTypes.string,
  }),
}; 