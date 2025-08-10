import { useState, useEffect } from 'react';

export const useAchievements = (userId) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievement, setAchievement] = useState({ isVisible: false, message: '' });

  // Проверяем достижения при изменении количества регистраций или созданных мероприятий
  const checkRegistrationAchievements = async (registrationsCount) => {
    const achievements = [
      { count: 5, message: 'Вы записались на 5 мероприятий! 🎯' },
      { count: 10, message: 'Вы записались на 10 мероприятий! 🚀' },
      { count: 15, message: 'Вы записались на 15 мероприятий! 🏆' }
    ];

    const achievement = achievements.find(a => a.count === registrationsCount);
    if (achievement) {
      triggerAchievement(achievement.message);
    }
  };

  const checkCreationAchievements = async (eventsCount) => {
    const achievements = [
      { count: 5, message: 'Вы создали 5 мероприятий! 🎨' },
      { count: 10, message: 'Вы создали 10 мероприятий! 🌟' },
      { count: 15, message: 'Вы создали 15 мероприятий! 👑' }
    ];

    const achievement = achievements.find(a => a.count === eventsCount);
    if (achievement) {
      triggerAchievement(achievement.message);
    }
  };

  const triggerAchievement = (message) => {
    setAchievement({ isVisible: true, message });
    setShowConfetti(true);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  const handleAchievementClose = () => {
    setAchievement({ isVisible: false, message: '' });
  };

  return {
    showConfetti,
    achievement,
    checkRegistrationAchievements,
    checkCreationAchievements,
    handleConfettiComplete,
    handleAchievementClose
  };
};
