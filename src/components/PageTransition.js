import React, { useState, useEffect } from 'react';
import { Div } from '@vkontakte/vkui';

export const PageTransition = ({ children, isVisible, onTransitionEnd }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
    if (onTransitionEnd) {
      onTransitionEnd();
    }
  };

  return (
    <Div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: isAnimating ? 'slideIn 0.4s ease-out' : 'none',
      }}
      onTransitionEnd={handleAnimationEnd}
    >
      {children}
    </Div>
  );
};

// Добавляем CSS анимации в глобальные стили
const transitionStyles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .page-transition-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .page-transition-exit {
    opacity: 1;
    transform: translateY(0);
  }

  .page-transition-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-hover {
    transition: all 0.3s ease;
  }

  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .button-hover {
    transition: all 0.3s ease;
  }

  .button-hover:hover {
    transform: scale(1.05);
  }

  .tab-transition {
    transition: all 0.3s ease;
  }

  .tab-transition:hover {
    transform: translateY(-1px);
  }
`;

// Добавляем стили в head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = transitionStyles;
  document.head.appendChild(styleElement);
}
