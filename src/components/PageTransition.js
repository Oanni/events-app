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
