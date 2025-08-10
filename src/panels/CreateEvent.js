import React, { useState } from 'react';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  FormItem, 
  Input, 
  Textarea, 
  Button,
  Div,
  Snackbar,
  Header,
  Select
} from '@vkontakte/vkui';
// DatePickerComponent заменен на нативные HTML поля
import { Icon28CalendarOutline, Icon28PlaceOutline, Icon28LinkOutline } from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { eventsAPI, handleAPIError } from '../services/api';
import { Navigation } from '../components/Navigation';
import { Confetti } from '../components/Confetti';
import { Achievement } from '../components/Achievement';
import { useAchievements } from '../hooks/useAchievements';
import PropTypes from 'prop-types';

export const CreateEvent = ({ id, fetchedUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    description: '',
    vkLink: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const routeNavigator = useRouteNavigator();
  
  // Система достижений
  const {
    showConfetti,
    achievement,
    checkCreationAchievements,
    handleConfettiComplete,
    handleAchievementClose
  } = useAchievements(fetchedUser?.id);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const fieldErrors = {};
    
    if (!formData.title.trim()) {
      fieldErrors.title = 'Название мероприятия обязательно для заполнения';
    }
    
    if (!formData.location.trim()) {
      fieldErrors.location = 'Место проведения обязательно для заполнения';
    }
    
    if (!formData.date) {
      fieldErrors.date = 'Дата проведения обязательна для заполнения';
    }
    
    if (!formData.time) {
      fieldErrors.time = 'Время проведения обязательно для заполнения';
    }
    
    if (!formData.description.trim()) {
      fieldErrors.description = 'Описание мероприятия обязательно для заполнения';
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!fetchedUser) {
      setSnackbar({
        text: 'Необходима авторизация для создания мероприятия',
        mode: 'error'
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Объединяем дату и время в один ISO формат
      const combinedDateTime = formData.date && formData.time 
        ? new Date(`${formData.date}T${formData.time}`).toISOString()
        : formData.date;

      const eventData = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        date: combinedDateTime,
        description: formData.description.trim(),
        created_by: fetchedUser.id, // Добавляем ID создателя
        vk_link: formData.vkLink.trim() || null,
      };

      await eventsAPI.create(eventData);

      // Проверяем достижения по количеству созданных мероприятий
      try {
        const userEvents = await eventsAPI.getMyEvents(fetchedUser.id);
        if (userEvents && userEvents.length > 0) {
          await checkCreationAchievements(userEvents.length);
        }
      } catch (error) {
        console.error('Ошибка при проверке достижений:', error);
      }

      setSnackbar({
        text: 'Мероприятие успешно создано!',
        mode: 'success'
      });

      // Очищаем форму
      setFormData({
        title: '',
        location: '',
        date: '',
        time: '',
        description: '',
        vkLink: '',
      });

      // Возвращаемся на главную через 2 секунды
      setTimeout(() => {
        routeNavigator.push('/');
      }, 2000);

    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSnackbar({
        text: errorMessage,
        mode: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    routeNavigator.push('/');
  };

  return (
    <Panel id={id} style={{ backgroundColor: '#000000' }}>
      <PanelHeader style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
        Создать мероприятие
      </PanelHeader>
      
      <Group style={{ backgroundColor: '#000000' }}>
        <Header style={{ color: '#FFFFFF' }}>
          Заполните информацию о мероприятии
        </Header>
        
        <Div style={{ padding: '16px' }}>
          <FormItem
            top="Название мероприятия *"
            status={errors.title ? 'error' : 'default'}
            bottom={errors.title}
          >
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Введите название мероприятия"
            />
          </FormItem>

          <FormItem
            top="Место проведения *"
            status={errors.location ? 'error' : 'default'}
            bottom={errors.location}
          >
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Введите место проведения"
              before={<Icon28PlaceOutline style={{ color: '#0077FF' }} />}
            />
          </FormItem>

          <FormItem
            top="Дата проведения *"
            status={errors.date ? 'error' : 'default'}
            bottom={errors.date}
          >
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormItem>

          <FormItem
            top="Время проведения *"
            status={errors.time ? 'error' : 'default'}
            bottom={errors.time}
          >
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
            />
          </FormItem>

          <FormItem
            top="Описание *"
            status={errors.description ? 'error' : 'default'}
            bottom={errors.description}
          >
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Опишите мероприятие подробно..."
              rows={4}
            />
          </FormItem>

          <FormItem top="Ссылка на ВК (необязательно)">
            <Input
              value={formData.vkLink}
              onChange={(e) => handleInputChange('vkLink', e.target.value)}
              placeholder="https://vk.com/..."
              before={<Icon28LinkOutline style={{ color: '#0077FF' }} />}
            />
          </FormItem>

          <Div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button
              mode="secondary"
              onClick={handleCancel}
              style={{ flex: 1 }}
            >
              Отмена
            </Button>
            <Button
              mode="primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Создание...' : 'Создать'}
            </Button>
          </Div>
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

CreateEvent.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo_200: PropTypes.string,
  }),
}; 