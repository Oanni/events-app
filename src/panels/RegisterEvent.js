import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  FormItem,
  Input,
  Select,
  Button,
  Snackbar,
  Div,
  Title,
  Text,
  Card
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { registrationsAPI, usersAPI, handleAPIError } from '../services/api';

export const RegisterEvent = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [event, setEvent] = useState(null);
  const [eventId, setEventId] = useState(null);

  const institutes = [
    { value: 'IT', label: 'Институт информационных технологий' },
    { value: 'IBI', label: 'Институт бизнеса и инноваций' },
    { value: 'IFKI', label: 'Институт физической культуры и спорта' },
    { value: 'IGSU', label: 'Институт гуманитарных и социальных наук' },
    { value: 'IMIT', label: 'Институт математики и информационных технологий' },
    { value: 'IPHT', label: 'Институт прикладных наук и технологий' },
  ];

  useEffect(() => {
    // Получаем ID мероприятия из URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    setEventId(id);

    if (id) {
      loadEvent();
    }

    // Проверяем профиль пользователя
    if (fetchedUser) {
      loadUserProfile();
    }
  }, [fetchedUser]);

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const eventData = await response.json();
        setEvent(eventData);
      }
    } catch (error) {
      console.error('Ошибка при загрузке мероприятия:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await usersAPI.getById(fetchedUser.id);
      if (response && response.length > 0) {
        setUserProfile(response[0]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
    }
  };

  const handleSubmit = async () => {
    if (!fetchedUser) {
      setSnackbar({
        text: 'Необходима авторизация для регистрации',
        mode: 'error'
      });
      return;
    }

    if (!eventId) {
      setSnackbar({
        text: 'Ошибка: ID мероприятия не найден',
        mode: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Отправляем данные регистрации:', {
        event_id: eventId,
        user_id: fetchedUser.id,
        user_profile_id: userProfile ? userProfile.id : null
      });

      const registrationData = {
        event_id: eventId,
        user_id: fetchedUser.id,
        user_profile_id: userProfile ? userProfile.id : null
      };

      const response = await registrationsAPI.create(registrationData);
      console.log('Ответ от API:', response);

      setSnackbar({
        text: 'Регистрация успешно завершена!',
        mode: 'success'
      });

      // Возвращаемся на детали мероприятия через 2 секунды
      setTimeout(() => {
        routeNavigator.push(`/event/${eventId}`);
      }, 2000);

    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      const errorMessage = handleAPIError(error);
      setSnackbar({
        text: errorMessage,
        mode: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!fetchedUser) return;

    try {
      await registrationsAPI.cancelRegistration(eventId, fetchedUser.id);
      
      setSnackbar({
        text: 'Регистрация отменена',
        mode: 'success'
      });

      // Возвращаемся на детали мероприятия через 2 секунды
      setTimeout(() => {
        routeNavigator.push(`/event/${eventId}`);
      }, 2000);

    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSnackbar({
        text: errorMessage,
        mode: 'error'
      });
    }
  };

  // Если у пользователя нет профиля, перенаправляем на создание профиля
  if (fetchedUser && !userProfile) {
    return (
      <Panel id={id}>
        <PanelHeader>Регистрация на мероприятие</PanelHeader>
        <Div>
          <Card style={{ padding: '20px', marginBottom: '20px' }}>
            <Title level="3" style={{ marginBottom: '12px' }}>
              Сначала создайте профиль
            </Title>
            <Text style={{ marginBottom: '16px', color: '#666' }}>
              Для регистрации на мероприятия необходимо создать профиль с вашими данными.
            </Text>
            <Button
              size="l"
              stretched
              onClick={() => routeNavigator.push('/profile')}
            >
              Создать профиль
            </Button>
          </Card>
        </Div>
      </Panel>
    );
  }

  return (
    <Panel id={id}>
      <PanelHeader>Регистрация на мероприятие</PanelHeader>
      
      <Div>
        {event && (
          <Card style={{ padding: '16px', marginBottom: '20px' }}>
            <Title level="3" style={{ marginBottom: '8px' }}>
              {event.title}
            </Title>
            <Text style={{ color: '#666', marginBottom: '8px' }}>
              {event.location}
            </Text>
            <Text style={{ color: '#666' }}>
              {new Date(event.date).toLocaleDateString('ru-RU')}
            </Text>
          </Card>
        )}

        {userProfile && (
          <Card style={{ padding: '16px', marginBottom: '20px' }}>
            <Title level="3" style={{ marginBottom: '12px' }}>
              Ваши данные для регистрации
            </Title>
            <Text style={{ marginBottom: '8px' }}>
              <strong>Имя:</strong> {userProfile.full_name}
            </Text>
            <Text style={{ marginBottom: '8px' }}>
              <strong>Дата рождения:</strong> {new Date(userProfile.birth_date).toLocaleDateString('ru-RU')}
            </Text>
            <Text style={{ marginBottom: '8px' }}>
              <strong>Институт:</strong> {institutes.find(i => i.value === userProfile.institute)?.label || userProfile.institute}
            </Text>
            <Text style={{ marginBottom: '8px' }}>
              <strong>Группа:</strong> {userProfile.academic_group}
            </Text>
          </Card>
        )}

        <Div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Button
            size="l"
            stretched
            loading={loading}
            onClick={handleSubmit}
          >
            Зарегистрироваться
          </Button>
        </Div>
      </Div>

      {snackbar && (
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={
            <div style={{ background: snackbar.mode === 'error' ? '#FF3B30' : '#4CAF50', width: 4, height: 4, borderRadius: '50%' }} />
          }
        >
          {snackbar.text}
        </Snackbar>
      )}
    </Panel>
  );
}; 