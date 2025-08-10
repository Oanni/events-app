import React, { useEffect, useState } from 'react';
import { Snackbar } from '@vkontakte/vkui';

export const Achievement = ({ isVisible, message, onClose }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsActive(true);
      // Автоматически скрываем через 4 секунды
      const timer = setTimeout(() => {
        setIsActive(false);
        setTimeout(() => {
          onClose && onClose();
        }, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: `translateX(-50%) translateY(${isActive ? '0' : '-100px'})`,
      zIndex: 10000,
      transition: 'transform 0.3s ease-out',
      backgroundColor: '#0077FF',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 119, 255, 0.3)',
      fontSize: '16px',
      fontWeight: '600',
      textAlign: 'center',
      maxWidth: '90%',
      wordWrap: 'break-word'
    }}>
      🎉 {message} 🎉
    </div>
  );
};
