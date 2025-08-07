import React, { useState } from 'react';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  Div,
  Title,
  Text,
  Button,
  Cell
} from '@vkontakte/vkui';
import {
  Icon28HelpOutline,
  Icon28CalendarOutline,
  Icon28UserOutline,
  Icon28AddOutline,
  Icon28ArrowLeftOutline,
  Icon28HeartCircleOutline
} from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Navigation } from '../components/Navigation';
import PropTypes from 'prop-types';

export const Help = ({ id, fetchedUser }) => {
  const [activeTab, setActiveTab] = useState('events');
  const routeNavigator = useRouteNavigator();

  const handleBack = () => {
    routeNavigator.push('/');
  };

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
        Помощь
      </PanelHeader>
      
      <Group style={{ backgroundColor: '#000000' }}>
        <Div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <Icon28HelpOutline style={{ color: '#0077FF', marginRight: '12px', fontSize: '32px' }} />
            <Title level="1" style={{ color: '#FFFFFF', margin: 0 }}>
              О приложении
            </Title>
          </div>

          <Text style={{ color: '#CCCCCC', lineHeight: '1.6', marginBottom: '24px' }}>
            Это приложение-агрегатор вузовских мероприятий, где вы можете создавать мероприятия, 
            просматривать доступные события и регистрироваться на них.
          </Text>

          <Title level="2" style={{ color: '#FFFFFF', marginBottom: '16px' }}>
            Основные функции
          </Title>

          <div style={{ marginBottom: '20px' }}>
            <Cell
              before={<Icon28CalendarOutline style={{ color: '#0077FF' }} />}
              style={{
                backgroundColor: '#1A1A1A',
                marginBottom: '8px',
                borderRadius: '8px',
              }}
            >
              <div>
                <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  Мероприятия
                </Text>
                <Text style={{ color: '#888888', fontSize: '14px' }}>
                  Просмотр всех доступных мероприятий
                </Text>
              </div>
            </Cell>

            <Cell
              before={<Icon28UserOutline style={{ color: '#0077FF' }} />}
              style={{
                backgroundColor: '#1A1A1A',
                marginBottom: '8px',
                borderRadius: '8px',
              }}
            >
              <div>
                <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  Мои мероприятия
                </Text>
                <Text style={{ color: '#888888', fontSize: '14px' }}>
                  Созданные вами мероприятия
                </Text>
              </div>
            </Cell>

            <Cell
              before={<Icon28HeartCircleOutline style={{ color: '#0077FF' }} />}
              style={{
                backgroundColor: '#1A1A1A',
                marginBottom: '8px',
                borderRadius: '8px',
              }}
            >
              <div>
                <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  Туда я пойду!
                </Text>
                <Text style={{ color: '#888888', fontSize: '14px' }}>
                  Мероприятия, на которые вы записались
                </Text>
              </div>
            </Cell>

            <Cell
              before={<Icon28AddOutline style={{ color: '#0077FF' }} />}
              style={{
                backgroundColor: '#1A1A1A',
                marginBottom: '8px',
                borderRadius: '8px',
              }}
            >
              <div>
                <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>
                  Создание мероприятия
                </Text>
                <Text style={{ color: '#888888', fontSize: '14px' }}>
                  Создайте свое мероприятие
                </Text>
              </div>
            </Cell>
          </div>

          <Title level="2" style={{ color: '#FFFFFF', marginBottom: '16px' }}>
            Как использовать
          </Title>

          <div style={{ marginBottom: '20px' }}>
            <Text style={{ color: '#CCCCCC', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>1. Просмотр мероприятий:</strong> На вкладке "Мероприятия" вы увидите все доступные события. 
              Используйте поиск для быстрого нахождения нужного мероприятия.
            </Text>

            <Text style={{ color: '#CCCCCC', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>2. Регистрация:</strong> Нажмите на мероприятие или кнопку "Записаться" для регистрации. 
              Заполните форму с вашими данными.
            </Text>

            <Text style={{ color: '#CCCCCC', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3. Создание мероприятия:</strong> Нажмите на кнопку "+" в правом нижнем углу и заполните форму.
            </Text>

            <Text style={{ color: '#CCCCCC', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>4. Отмена регистрации:</strong> В разделе "Туда я пойду!" или на странице мероприятия 
              нажмите "Отменить регистрацию".
            </Text>
          </div>

          <Title level="2" style={{ color: '#FFFFFF', marginBottom: '16px' }}>
            Поддерживаемые институты
          </Title>

          <Text style={{ color: '#CCCCCC', lineHeight: '1.6', marginBottom: '12px' }}>
            ИТ, ИНМИН, ИКН, ЭУПП, ГИ, ИБО, ИБИ, ИФКИ, ИР
          </Text>

          <Title level="2" style={{ color: '#FFFFFF', marginBottom: '16px' }}>
            Техническая поддержка
          </Title>

          <Text style={{ color: '#CCCCCC', lineHeight: '1.6', marginBottom: '24px' }}>
            Если у вас возникли вопросы или проблемы с приложением, обратитесь к разработчикам.
          </Text>

          <Button
            mode="primary"
            onClick={handleBack}
            style={{
              backgroundColor: '#0077FF',
              border: 'none',
              width: '100%',
            }}
          >
            Понятно
          </Button>
        </Div>
      </Group>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </Panel>
  );
};

Help.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo_200: PropTypes.string,
  }),
}; 