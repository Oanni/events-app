import { createRoot } from 'react-dom/client';
import bridge from '@vkontakte/vk-bridge';
import { App } from './App';
import { AppConfig } from './AppConfig';
import { RouterProvider } from '@vkontakte/vk-mini-apps-router';
import { router } from './routes';
import '@vkontakte/vkui/dist/vkui.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import './styles/global.css';

// Инициализация VK Bridge
bridge.send('VKWebAppInit');

// Дополнительные стили для специфичных компонентов
const additionalStyles = `
  * {
    box-sizing: border-box;
  }

  .vkuiDiv {
    background-color: transparent !important;
  }

  .vkuiSearch {
    background-color: #1A1A1A !important;
    border: 1px solid #333 !important;
    color: #FFFFFF !important;
  }

  .vkuiPlaceholder {
    background-color: transparent !important;
  }

  /* Стили для Syncfusion DatePicker */
  .custom-datepicker {
    background-color: #1A1A1A !important;
    border: 1px solid #333 !important;
    color: #FFFFFF !important;
  }

  .custom-datepicker .e-input-group {
    background-color: #1A1A1A !important;
    border: 1px solid #333 !important;
    color: #FFFFFF !important;
  }

  .custom-datepicker .e-input-group input {
    background-color: #1A1A1A !important;
    border: 1px solid #333 !important;
    color: #FFFFFF !important;
  }

  .custom-datepicker .e-calendar {
    background-color: #1A1A1A !important;
    border: 1px solid #333 !important;
    color: #FFFFFF !important;
  }

  .custom-datepicker .e-calendar .e-header {
    background-color: #1A1A1A !important;
    color: #FFFFFF !important;
  }

  .custom-datepicker .e-calendar .e-content {
    background-color: #1A1A1A !important;
    color: #FFFFFF !important;
  }

  .custom-datepicker .e-calendar .e-day {
    color: #FFFFFF !important;
  }

  .custom-datepicker .e-calendar .e-day:hover {
    background-color: #0077FF !important;
    color: #FFFFFF !important;
  }

  .custom-datepicker .e-calendar .e-selected {
    background-color: #0077FF !important;
    color: #FFFFFF !important;
  }

  /* Стили для круглых плавающих кнопок */
  button[aria-label="Создать мероприятие"],
  button[aria-label="Помощь"] {
    border-radius: 50% !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }

  /* Центрирование содержимого кнопок */
  button[aria-label="Создать мероприятие"] *,
  button[aria-label="Помощь"] * {
    margin: 0 !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  button[aria-label="Создать мероприятие"] {
    width: 56px !important;
    height: 56px !important;
    min-width: 56px !important;
    min-height: 56px !important;
  }

  button[aria-label="Помощь"] {
    width: 48px !important;
    height: 48px !important;
    min-width: 48px !important;
    min-height: 48px !important;
  }

  /* Убираем лишние отступы у внутренних элементов VKUI */
  button[aria-label="Создать мероприятие"] .vkuiButton__content,
  button[aria-label="Помощь"] .vkuiButton__content {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Дополнительные стили для полей даты и времени */
  input[type="date"],
  input[type="time"] {
    color-scheme: dark;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

   /* Анимация для спиннера */
   @keyframes spin {
     0% { transform: rotate(0deg); }
     100% { transform: rotate(360deg); }
   }
`;

// Добавляем стили в head
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AppConfig>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </AppConfig>
);

if (import.meta.env.MODE === 'development') {
  import('./eruda.js');
}
