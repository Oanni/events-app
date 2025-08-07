import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import { Platform } from '@vkontakte/vkui';

export const AppConfig = ({ children }) => {
  return (
    <ConfigProvider platform={Platform.ANDROID}>
      <AdaptivityProvider>
        {children}
      </AdaptivityProvider>
    </ConfigProvider>
  );
};
