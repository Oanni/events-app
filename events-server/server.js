const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { testConnection, createTables } = require('./config/database');

// Импортируем маршруты
const eventsRoutes = require('./routes/events');
const registrationsRoutes = require('./routes/registrations');

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:10888', 
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://localhost:3443',
    'https://user221044736-wzfys7y6.tunnel.vk-apps.com',
    /^https:\/\/.*\.tunnel\.vk-apps\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Базовый маршрут для проверки
app.get('/', (req, res) => {
  res.json({ 
    message: 'Events API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Маршрут для проверки здоровья сервера
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Подключаем API маршруты
app.use('/api/events', eventsRoutes);
app.use('/api/registrations', registrationsRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Инициализация сервера
async function startServer() {
  try {
    // Проверяем подключение к базе данных
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Cannot start server without database connection');
      process.exit(1);
    }

    // Создаем таблицы если их нет
    await createTables();

    // Запускаем сервер
    const server = app.listen(PORT, () => {
      console.log(`🚀 HTTP Server is running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}`);
      console.log(`🗄️ Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
    });

    // Также запускаем HTTPS сервер для туннеля
    try {
      const httpsOptions = {
        key: fs.readFileSync(path.join(process.env.APPDATA || process.env.HOME, 'https-localhost/localhost.key')),
        cert: fs.readFileSync(path.join(process.env.APPDATA || process.env.HOME, 'https-localhost/localhost.crt'))
      };
      
      https.createServer(httpsOptions, app).listen(3443, () => {
        console.log(`🔒 HTTPS Server is running on port 3443`);
        console.log(`📡 Health check: https://localhost:3443/health`);
        console.log(`🌐 API Base URL: https://localhost:3443`);
      });
    } catch (error) {
      console.log('⚠️ HTTPS server not started (certificates not found)');
      console.log('💡 Run: npx https-localhost to generate certificates');
    }
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
}

// Запускаем сервер
startServer();
