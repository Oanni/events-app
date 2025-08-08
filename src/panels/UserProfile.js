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
  Text
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { usersAPI, handleAPIError } from '../services/api';

export const UserProfile = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    institute: '',
    academicGroup: '',
  });

  const institutes = [
    { value: 'IT', label: 'Институт информационных технологий' },
    { value: 'IBI', label: 'Институт бизнеса и инноваций' },
    { value: 'IFKI', label: 'Институт физической культуры и спорта' },
    { value: 'IGSU', label: 'Институт гуманитарных и социальных наук' },
    { value: 'IMIT', label: 'Институт математики и информационных технологий' },
    { value: 'IPHT', label: 'Институт прикладных наук и технологий' },
  ];

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setSnackbar({
        text: 'Введите полное имя',
        mode: 'error'
      });
      return false;
    }

    if (!formData.birthDate) {
      setSnackbar({
        text: 'Выберите дату рождения',
        mode: 'error'
      });
      return false;
    }

    if (!formData.institute) {
      setSnackbar({
        text: 'Выберите институт',
        mode: 'error'
      });
      return false;
    }

    if (!formData.academicGroup.trim()) {
      setSnackbar({
        text: 'Введите академическую группу',
        mode: 'error'
      });
      return false;
    }

    return true;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!fetchedUser) {
      setSnackbar({
        text: 'Необходима авторизация',
        mode: 'error'
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        id: fetchedUser.id,
        full_name: formData.fullName.trim(),
        birth_date: formData.birthDate,
        institute: formData.institute,
        academic_group: formData.academicGroup.trim(),
      };

      console.log('Создаем профиль пользователя:', userData);

      await usersAPI.create(userData);

      setSnackbar({
        text: 'Профиль успешно создан!',
        mode: 'success'
      });

      // Возвращаемся на главную через 2 секунды
      setTimeout(() => {
        routeNavigator.push('/');
      }, 2000);

    } catch (error) {
      console.error('Ошибка при создании профиля:', error);
      const errorMessage = handleAPIError(error);
      setSnackbar({
        text: errorMessage,
        mode: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Создание профиля</PanelHeader>
      
      <Div>
        <Title level="2" style={{ marginBottom: '16px' }}>
          Добро пожаловать!
        </Title>
        <Text style={{ marginBottom: '24px', color: '#666' }}>
          Для участия в мероприятиях необходимо создать профиль. 
          Эти данные будут использоваться при регистрации на мероприятия.
        </Text>

        <FormItem top="Полное имя *">
          <Input
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Введите полное имя"
          />
        </FormItem>

        <FormItem top="Дата рождения *">
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            placeholder="Выберите дату рождения"
          />
        </FormItem>

        <FormItem top="Институт *">
          <Select
            value={formData.institute}
            onChange={(e) => handleInputChange('institute', e.target.value)}
            placeholder="Выберите институт"
          >
            {institutes.map(institute => (
              <option key={institute.value} value={institute.value}>
                {institute.label}
              </option>
            ))}
          </Select>
        </FormItem>

        <FormItem top="Академическая группа *">
          <Input
            value={formData.academicGroup}
            onChange={(e) => handleInputChange('academicGroup', e.target.value)}
            placeholder="Например: БПИ-23-5"
          />
        </FormItem>

        <Div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Button
            size="l"
            stretched
            loading={loading}
            onClick={handleSubmit}
          >
            Создать профиль
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
