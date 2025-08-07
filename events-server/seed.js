const { query } = require('./config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Начинаем заполнение базы данных тестовыми данными...');

    // Добавляем тестового пользователя
    const userSql = `
      INSERT INTO users (vk_id, first_name, last_name, photo_200) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      first_name = VALUES(first_name), 
      last_name = VALUES(last_name), 
      photo_200 = VALUES(photo_200)
    `;
    
    const userResult = await query(userSql, [
      '123456789',
      'Иван',
      'Иванов',
      'https://vk.com/images/default_avatar.png'
    ]);
    
    const userId = userResult.insertId || 1;
    console.log(`✅ Пользователь создан/обновлен с ID: ${userId}`);

    // Добавляем тестовые мероприятия
    const events = [
      {
        title: 'Хакатон МИСИС 2024',
        location: 'Аудитория 101, Главный корпус',
        date: '2024-12-15 10:00:00',
        description: 'Грандиозный хакатон для студентов МИСИС! Создавайте инновационные проекты, решайте реальные задачи и выигрывайте призы. Участие бесплатное, регистрация обязательна.',
        vk_link: 'https://vk.com/hackathon_misis',
        created_by: userId
      },
      {
        title: 'Встреча выпускников',
        location: 'Актовый зал',
        date: '2024-12-20 18:00:00',
        description: 'Традиционная встреча выпускников МИСИС. Воспоминания, новые знакомства, общение с преподавателями. Приглашаются все выпускники!',
        vk_link: 'https://vk.com/alumni_misis',
        created_by: userId
      },
      {
        title: 'Мастер-класс по программированию',
        location: 'Компьютерный класс 205',
        date: '2024-12-25 14:00:00',
        description: 'Практический мастер-класс по современным технологиям программирования. JavaScript, React, Node.js. Для студентов всех курсов.',
        vk_link: null,
        created_by: userId
      }
    ];

    for (const event of events) {
      const eventSql = `
        INSERT INTO events (title, location, date, description, vk_link, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const eventResult = await query(eventSql, [
        event.title,
        event.location,
        event.date,
        event.description,
        event.vk_link,
        event.created_by
      ]);
      
      console.log(`✅ Мероприятие "${event.title}" создано с ID: ${eventResult.insertId}`);
    }

    // Добавляем тестовые регистрации
    const registrations = [
      {
        event_id: 1, // Хакатон
        user_id: userId,
        full_name: 'Петр Петров',
        birth_date: '2000-05-15',
        institute: 'ИТ',
        academic_group: 'ИС-20-1'
      },
      {
        event_id: 1, // Хакатон
        user_id: userId,
        full_name: 'Анна Сидорова',
        birth_date: '2001-03-22',
        institute: 'ИТ',
        academic_group: 'ИС-20-2'
      },
      {
        event_id: 2, // Встреча выпускников
        user_id: userId,
        full_name: 'Мария Козлова',
        birth_date: '1995-08-10',
        institute: 'МТ',
        academic_group: 'МТ-15-1'
      }
    ];

    for (const registration of registrations) {
      const regSql = `
        INSERT INTO registrations (event_id, user_id, full_name, birth_date, institute, academic_group)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      await query(regSql, [
        registration.event_id,
        registration.user_id,
        registration.full_name,
        registration.birth_date,
        registration.institute,
        registration.academic_group
      ]);
      
      console.log(`✅ Регистрация "${registration.full_name}" создана`);
    }

    console.log('🎉 База данных успешно заполнена тестовыми данными!');
    console.log('\n📊 Статистика:');
    console.log('- Пользователей: 1');
    console.log('- Мероприятий: 3');
    console.log('- Регистраций: 3');

  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error);
  } finally {
    process.exit(0);
  }
}

// Запускаем заполнение
seedDatabase();
