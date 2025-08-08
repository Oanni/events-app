import { App as VKApp, ConfigProvider, AdaptivityProvider, Platform } from '@vkontakte/vkui';
import { RouterProvider, createHashRouter } from '@vkontakte/vk-mini-apps-router';
import { Home } from './panels/Home';
import { Events } from './panels/Events';
import { CreateEvent } from './panels/CreateEvent';
import { EventDetails } from './panels/EventDetails';
import { RegisterEvent } from './panels/RegisterEvent';
import { MyEvents } from './panels/MyEvents';
import { MyRegistrations } from './panels/MyRegistrations';
import { UserProfile } from './panels/UserProfile';
import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

const router = createHashRouter([
  {
    path: '/',
    panel: 'home',
    view: 'main',
  },
  {
    path: '/events',
    panel: 'events',
    view: 'main',
  },
  {
    path: '/create',
    panel: 'create',
    view: 'main',
  },
  {
    path: '/event/:id',
    panel: 'event-details',
    view: 'main',
  },
  {
    path: '/register/:id',
    panel: 'register',
    view: 'main',
  },
  {
    path: '/my-events',
    panel: 'my-events',
    view: 'main',
  },
  {
    path: '/my-registrations',
    panel: 'my-registrations',
    view: 'main',
  },
  {
    path: '/profile',
    panel: 'profile',
    view: 'main',
  },
]);

function App() {
  const [fetchedUser, setFetchedUser] = useState(null);
  const [popout, setPopout] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setFetchedUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  return (
    <ConfigProvider platform={Platform.ANDROID} appearance="dark">
      <AdaptivityProvider>
        <VKApp>
          <RouterProvider router={router}>
            <Home id="home" fetchedUser={fetchedUser} />
            <Events id="events" fetchedUser={fetchedUser} />
            <CreateEvent id="create" fetchedUser={fetchedUser} />
            <EventDetails id="event-details" fetchedUser={fetchedUser} />
            <RegisterEvent id="register" fetchedUser={fetchedUser} />
            <MyEvents id="my-events" fetchedUser={fetchedUser} />
            <MyRegistrations id="my-registrations" fetchedUser={fetchedUser} />
            <UserProfile id="profile" fetchedUser={fetchedUser} />
          </RouterProvider>
        </VKApp>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;
