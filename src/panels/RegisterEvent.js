import React, { useState, useEffect } from 'react';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  FormItem, 
  Input, 
  Button,
  Div,
  Snackbar,
  Header,
  Text,
  Avatar,
  ScreenSpinner
} from '@vkontakte/vkui';
// DatePickerComponent заменен на нативное поле
import { Icon28ArrowLeftOutline } from '@vkontakte/icons';
import { useRouteNavigator, useParams, useSearchParams } from '@vkontakte/vk-mini-apps-router';
import { eventsAPI, registrationsAPI, handleAPIError } from '../services/api';
import { Navigation } from '../components/Navigation';
import bridge from '@vkontakte/vk-bridge';

// Массив институтов
const INSTITUTES = [
  { id: 'IT', name: 'ИТ' },
  { id: 'INMIN', name: 'ИНМИН' },
  { id: 'IKN', name: 'ИКН' },
  { id: 'EUPP', name: 'ЭУПП' },
  { id: 'GI', name: 'ГИ' },
  { id: 'IBO', name: 'ИБО' },
  { id: 'IBI', name: 'ИБИ' },
  { id: 'IFKI', name: 'ИФКИ' },
  { id: 'IR', name: 'ИР' },
];
import PropTypes from 'prop-types';

export const RegisterEvent = ({ id, fetchedUser }) => {
  const institutesArray = INSTITUTES;
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    institute: '',
    academicGroup: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [isCancelMode, setIsCancelMode] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [vkUserData, setVkUserData] = useState(null);
  const routeNavigator = useRouteNavigator();
  const { id: eventId } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadEvent();
    const action = searchParams.get('action');
    setIsCancelMode(action === 'cancel');
    loadUserData();
  }, [eventId]);

  const loadUserData = async () => {
    if (!fetchedUser) return;
    
    setUserDataLoading(true);
    try {
      const userData = await bridge.send('VKWebAppGetUserInfo', {});
      setVkUserData(userData);
      
      // Автозаполняем форму полученными данными
      const fullName = `${userData.first_name} ${userData.last_name}`;
      let birthDate = '';
      
      // Обрабатываем дату рождения если доступна
      if (userData.bdate && userData.bdate_visibility > 0) {
        const bdateParts = userData.bdate.split('.');
        if (bdateParts.length >= 3) {
          // Формат VK: DD.MM.YYYY, нужно преобразовать в YYYY-MM-DD
          birthDate = `${bdateParts[2]}-${bdateParts[1].padStart(2, '0')}-${bdateParts[0].padStart(2, '0')}`;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        fullName: fullName,
        birthDate: birthDate,
      }));
      
    } catch (error) {
      console.log('Не удалось получить данные пользователя:', error);
      // Не показываем ошибку пользователю, просто работаем без автозаполнения
    } finally {
      setUserDataLoading(false);
    }
  };

  const loadEvent = async () => {
    try {
      const response = await eventsAPI.getById(eventId);
      if (!response.data) {
        routeNavigator.push('/');
        return;
      }
      setEvent(response.data);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSnackbar({ text: errorMessage, mode: 'error' });
      routeNavigator.push('/');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const fieldErrors = {};
    
    if (!formData.fullName.trim()) {
      fieldErrors.fullName = 'ФИО обязательно для заполнения';
    }
    
    if (!formData.birthDate) {
      fieldErrors.birthDate = 'Дата рождения обязательна для заполнения';
    }
    
    if (!formData.institute) {
      fieldErrors.institute = 'Институт обязателен для заполнения';
    }
    
    if (!formData.academicGroup.trim()) {
      fieldErrors.academicGroup = 'Академическая группа обязательна для заполнения';
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!fetchedUser) {
      setSnackbar({
        text: 'Необходима авторизация для регистрации',
        mode: 'error'
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        event_id: parseInt(eventId),
        full_name: formData.fullName.trim(),
        birth_date: formData.birthDate,
        institute: formData.institute,
        academic_group: formData.academicGroup.trim(),
      };

      await registrationsAPI.create(registrationData);

      setSnackbar({
        text: 'Регистрация успешно завершена!',
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
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!fetchedUser) return;

    try {
      await registrationsAPI.cancelRegistration(eventId);
      
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
      setSnackbar({ text: errorMessage, mode: 'error' });
    }
  };

  const handleBack = () => {
    routeNavigator.push(`/event/${eventId}`);
  };

  if (!event) {
    return (
      <Panel id={id} style={{ backgroundColor: '#000000' }}>
        <PanelHeader style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
          Загрузка...
        </PanelHeader>
        <Div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text style={{ color: '#FFFFFF' }}>Загрузка мероприятия...</Text>
        </Div>
      </Panel>
    );
  }

  return (
    <Panel id={id} style={{ backgroundColor: '#000000' }}>
      <PanelHeader 
        style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
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
        {isCancelMode ? 'Отменить регистрацию' : 'Регистрация'}
      </PanelHeader>
      
      <Group style={{ backgroundColor: '#000000' }}>
        <Header style={{ color: '#FFFFFF' }}>
          {isCancelMode ? 'Отменить регистрацию' : 'Заполните данные для регистрации'}
        </Header>
        
        {isCancelMode ? (
          <Div style={{ padding: '16px' }}>
            <Text style={{ color: '#CCCCCC', marginBottom: '24px' }}>
              Вы уверены, что хотите отменить регистрацию на мероприятие "{event.title}"?
            </Text>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                mode="secondary"
                onClick={handleBack}
                style={{ flex: 1 }}
              >
                Нет, оставить
              </Button>
              <Button
                mode="primary"
                onClick={handleCancelRegistration}
                style={{
                  flex: 1,
                  backgroundColor: '#FF3B30',
                }}
              >
                Отменить регистрацию
              </Button>
            </div>
          </Div>
        ) : (
          <Div style={{ padding: '16px' }}>
            {/* Отображение информации о пользователе */}
            {vkUserData && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#1A1A1A',
                borderRadius: '12px',
                border: '1px solid #333'
              }}>
                <Avatar 
                  size={48} 
                  src={vkUserData.photo_100} 
                  style={{ marginRight: '12px' }}
                />
                <div>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: '4px' }}>
                    {vkUserData.first_name} {vkUserData.last_name}
                  </Text>
                  <Text style={{ color: '#AAAAAA', fontSize: '14px' }}>
                    Данные автоматически заполнены из вашего профиля VK
                  </Text>
                </div>
              </div>
            )}

            {/* Индикатор загрузки данных пользователя */}
            {userDataLoading && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#1A1A1A',
                borderRadius: '12px',
                border: '1px solid #333'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #333',
                  borderTop: '2px solid #0077FF',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }} />
                <Text style={{ color: '#AAAAAA' }}>Загружаем ваши данные...</Text>
              </div>
            )}

            <FormItem
              top="ФИО *"
              status={errors.fullName ? 'error' : 'default'}
              bottom={errors.fullName}
            >
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Введите полное имя"
              />
            </FormItem>

            <FormItem
              top="Дата рождения *"
              status={errors.birthDate ? 'error' : 'default'}
              bottom={errors.birthDate}
            >
              <input
                type="date"
                value={formData.birthDate ? formData.birthDate.split('T')[0] : ''}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </FormItem>

            <FormItem
              top="Институт *"
              status={errors.institute ? 'error' : 'default'}
              bottom={errors.institute}
            >
              <select
                value={formData.institute}
                onChange={(e) => handleInputChange('institute', e.target.value)}
              >
                <option value="">
                  Выберите институт
                </option>
                {institutesArray.map(institute => (
                  <option 
                    key={institute.id} 
                    value={institute.id}
                  >
                    {institute.name}
                  </option>
                ))}
              </select>
            </FormItem>

            <FormItem
              top="Академическая группа *"
              status={errors.academicGroup ? 'error' : 'default'}
              bottom={errors.academicGroup}
            >
              <Input
                value={formData.academicGroup}
                onChange={(e) => handleInputChange('academicGroup', e.target.value)}
                placeholder="Например: БПИ-22-1"
              />
            </FormItem>

            <Div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button
                mode="secondary"
                onClick={handleBack}
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
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </Div>
          </Div>
        )}
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

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </Panel>
  );
};

RegisterEvent.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo_200: PropTypes.string,
  }),
}; 