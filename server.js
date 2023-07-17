{const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');
const { saveDataToDatabase } = require('./database');
const express = require('express');
const mongoose = require('mongoose');

// Замените <connection-string> на вашу строку подключения MongoDB Atlas
const connectionString = 'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/';
const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';



const app = express();
// Загрузка данных из базы данных и передача на клиентскую сторону
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find(); // Получение всех постов из базы данных
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const bot = new TelegramBot(token, { polling: true });
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('Установлено новое WebSocket соединение');
  ws.on('message', (message) => {
    console.log('Получено сообщение из WebSocket:', message);
  });
});


bot.on('message', (msg) => {
  const messageData = msg;
  console.log('Получено сообщение:', messageData);
  const messageDataString = JSON.stringify(messageData);
  wss.clients.forEach((client) => {
    client.send(messageDataString);
  });

  saveDataToDatabase(messageData); // Сохранение данных в базе данных

  bot.sendMessage(msg.chat.id, 'Получено');
});



mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('MongoDB connected');
  // Запуск веб-сервера после успешного подключения к MongoDB
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
})}
