import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { 
  View, 
  SplitLayout, 
  SplitCol, 
  ScreenSpinner,
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Platform
} from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { 
  Events, 
  MyEvents, 
  MyRegistrations, 
  CreateEvent, 
  EventDetails, 
  RegisterEvent, 
  Help 
} from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.EVENTS } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner />);

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  return (
    <ConfigProvider platform={Platform.ANDROID} appearance="dark">
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <SplitCol>
              <View activePanel={activePanel}>
                <Events id={DEFAULT_VIEW_PANELS.EVENTS} fetchedUser={fetchedUser} />
                <MyEvents id={DEFAULT_VIEW_PANELS.MY_EVENTS} fetchedUser={fetchedUser} />
                <MyRegistrations id={DEFAULT_VIEW_PANELS.MY_REGISTRATIONS} fetchedUser={fetchedUser} />
                <CreateEvent id={DEFAULT_VIEW_PANELS.CREATE_EVENT} fetchedUser={fetchedUser} />
                <EventDetails id={DEFAULT_VIEW_PANELS.EVENT_DETAILS} fetchedUser={fetchedUser} />
                <RegisterEvent id={DEFAULT_VIEW_PANELS.REGISTER_EVENT} fetchedUser={fetchedUser} />
                <Help id={DEFAULT_VIEW_PANELS.HELP} fetchedUser={fetchedUser} />
              </View>
            </SplitCol>
            {popout}
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};
