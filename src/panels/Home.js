import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Spinner, Snackbar } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { eventsAPI, dateUtils, handleAPIError } from '../services/api';
import { EventCard } from '../components/EventCard';

export const Home = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(null);

  // Загружаем мероприятия при монтировании компонента
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      setEvents(response.data || []);
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

  const handleMyEvents = () => {
    routeNavigator.push('/my-events');
  };

  const handleRegisterEvent = () => {
    routeNavigator.push('/register-event');
  };

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      
      {fetchedUser && (
        <Group header={<Header size="s">Добро пожаловать!</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header size="s">Действия</Header>}>
        <Div>
          <Button 
            stretched 
            size="l" 
            mode="primary" 
            onClick={handleCreateEvent}
            style={{ marginBottom: '12px' }}
          >
            Создать мероприятие
          </Button>
          <Button 
            stretched 
            size="l" 
            mode="secondary" 
            onClick={handleMyEvents}
            style={{ marginBottom: '12px' }}
          >
            Мои мероприятия
          </Button>
          <Button 
            stretched 
            size="l" 
            mode="secondary" 
            onClick={handleRegisterEvent}
          >
            Зарегистрироваться на мероприятие
          </Button>
        </Div>
      </Group>

      <Group header={<Header size="s">Все мероприятия</Header>}>
        {loading ? (
          <Div style={{ textAlign: 'center', padding: '20px' }}>
            <Spinner size="medium" />
          </Div>
        ) : events.length === 0 ? (
          <Div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Пока нет мероприятий. Создайте первое!</p>
          </Div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={handleEventPress}
              isRegistered={false}
              showRegisterButton={true}
            />
          ))
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
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
