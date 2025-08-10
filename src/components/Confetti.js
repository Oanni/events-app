import React, { useEffect, useState } from 'react';

export const Confetti = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Создаем частицы конфетти
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 7)],
        size: Math.random() * 8 + 4
      }));

      setParticles(newParticles);

      // Анимация конфетти
      const animation = setInterval(() => {
        setParticles(prevParticles => {
          const updatedParticles = prevParticles.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            rotation: particle.rotation + particle.rotationSpeed,
            vy: particle.vy + 0.1 // гравитация
          })).filter(particle => particle.y < window.innerHeight + 50);

          if (updatedParticles.length === 0) {
            clearInterval(animation);
            onComplete && onComplete();
          }

          return updatedParticles;
        });
      }, 16);

      return () => clearInterval(animation);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: `rotate(${particle.rotation}deg)`,
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
};
