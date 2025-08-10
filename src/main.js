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

// Улучшение работы полей даты и времени на мобильных устройствах
const improveDateTimeInputs = () => {
  // Функция для улучшения работы полей даты
  const improveDateInput = (input) => {
    // Предотвращаем зум на iOS
    input.addEventListener('focus', () => {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
        }, 100);
      }
    });

    // Улучшаем отзывчивость на тач
    input.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    }, { passive: true });

    // Добавляем визуальную обратную связь
    input.addEventListener('mousedown', () => {
      input.style.transform = 'scale(0.98)';
    });

    input.addEventListener('mouseup', () => {
      input.style.transform = 'scale(1)';
    });

    input.addEventListener('mouseleave', () => {
      input.style.transform = 'scale(1)';
    });

    // Для мобильных устройств
    input.addEventListener('touchend', () => {
      input.style.transform = 'scale(0.98)';
      setTimeout(() => {
        input.style.transform = 'scale(1)';
      }, 150);
    });
  };

  // Функция для улучшения работы полей времени
  const improveTimeInput = (input) => {
    // Предотвращаем зум на iOS
    input.addEventListener('focus', () => {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
        }, 100);
      }
    });

    // Улучшаем отзывчивость на тач
    input.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    }, { passive: true });

    // Добавляем визуальную обратную связь
    input.addEventListener('mousedown', () => {
      input.style.transform = 'scale(0.98)';
    });

    input.addEventListener('mouseup', () => {
      input.style.transform = 'scale(1)';
    });

    input.addEventListener('mouseleave', () => {
      input.style.transform = 'scale(1)';
    });

    // Для мобильных устройств
    input.addEventListener('touchend', () => {
      input.style.transform = 'scale(0.98)';
      setTimeout(() => {
        input.style.transform = 'scale(1)';
      }, 150);
    });
  };

  // Применяем улучшения к существующим полям
  document.querySelectorAll('input[type="date"]').forEach(improveDateInput);
  document.querySelectorAll('input[type="time"]').forEach(improveTimeInput);

  // Наблюдаем за добавлением новых полей
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.matches && node.matches('input[type="date"]')) {
            improveDateInput(node);
          } else if (node.matches && node.matches('input[type="time"]')) {
            improveTimeInput(node);
          }
          
          // Проверяем дочерние элементы
          node.querySelectorAll && node.querySelectorAll('input[type="date"]').forEach(improveDateInput);
          node.querySelectorAll && node.querySelectorAll('input[type="time"]').forEach(improveTimeInput);
        }
      });
    });
  });

  // Начинаем наблюдение
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// Запускаем улучшения после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', improveDateTimeInputs);
} else {
  improveDateTimeInputs();
}

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
