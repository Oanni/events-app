import React from 'react';
import { 
  Tabbar, 
  TabbarItem, 
  FixedLayout, 
  Button, 
  Div 
} from '@vkontakte/vkui';
import {
  Icon28CalendarOutline,
  Icon28UserOutline,
  Icon28AddOutline,
  Icon28HelpOutline,
  Icon28HeartCircleOutline
} from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { DEFAULT_VIEW_PANELS } from '../routes';
import PropTypes from 'prop-types';

export const Navigation = ({ activeTab, onTabChange }) => {
  const routeNavigator = useRouteNavigator();

  const tabs = [
    {
      id: 'events',
      text: 'Мероприятия',
      ariaLabel: 'Просмотр всех доступных мероприятий',
      icon: <Icon28CalendarOutline />,
      route: '/',
    },
    {
      id: 'my_events',
      text: 'Мои',
      ariaLabel: 'Мероприятия, созданные мной',
      icon: <Icon28UserOutline />,
      route: '/my-events',
    },
      {
    id: 'my_registrations',
    text: 'Туда я пойду!',
    ariaLabel: 'Мероприятия, на которые я записался',
    icon: <Icon28HeartCircleOutline />,
    route: '/my-registrations',
  },
  ];

  const handleTabClick = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      routeNavigator.push(tab.route);
      onTabChange(tabId);
    }
  };

  const handleCreateEvent = () => {
    routeNavigator.push('/create-event');
  };

  const handleHelp = () => {
    routeNavigator.push('/help');
  };

  return (
    <FixedLayout vertical="bottom">
      <Div style={{ padding: 0 }}>
        <Tabbar>
          {tabs.map((tab) => (
            <TabbarItem
              key={tab.id}
              selected={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              text={tab.text}
              aria-label={tab.ariaLabel}
            >
              {tab.icon}
            </TabbarItem>
          ))}
        </Tabbar>
      </Div>
      
      {/* Кнопка создания мероприятия */}
      <div style={{ 
        position: 'fixed', 
        bottom: '80px', 
        right: '16px', 
        zIndex: 1000 
      }}>
        <Button
          size="l"
          mode="primary"
          onClick={handleCreateEvent}
          aria-label="Создать мероприятие"
          style={{
            width: '56px',
            height: '56px',
            minWidth: '56px',
            minHeight: '56px',
            borderRadius: '50%',
            backgroundColor: '#0077FF',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 119, 255, 0.4)',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon28AddOutline />
        </Button>
      </div>

      {/* Кнопка помощи */}
      <div style={{ 
        position: 'fixed', 
        bottom: '80px', 
        left: '16px', 
        zIndex: 1000 
      }}>
        <Button
          size="l"
          mode="secondary"
          onClick={handleHelp}
          aria-label="Помощь"
          style={{
            width: '48px',
            height: '48px',
            minWidth: '48px',
            minHeight: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon28HelpOutline />
        </Button>
      </div>
    </FixedLayout>
  );
};

Navigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
}; 