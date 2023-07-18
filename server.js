
// const express = require('express');
// const mongoose = require('mongoose');

// Замените <connection-string> на вашу строку подключения MongoDB Atlas
//const connectionString = 'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/';
{const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');
const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';

const bot = new TelegramBot(token, { polling: true });
const wss = new WebSocket.Server({ port: 8080 });


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
  bot.sendMessage(msg.chat.id, 'Получено');
});}

// const app = express();
// const port = 5050;

// // Создание схемы и модели для коллекции "posts"
// const postSchema = new mongoose.Schema({
//   name: String,
//   url: String,
//   messageText: String,
// });

// const Post = mongoose.model('Post', postSchema);

// // Подключение к MongoDB
// mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB connected');
//     // Запуск веб-сервера после успешного подключения к MongoDB
//     app.listen(port, () => {
//       console.log(`Server started on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });

// // Загрузка данных из базы данных и передача на клиентскую сторону
// app.get('capybaraWebsite/index.html/local', async (req, res) => {
//   try {
//     // Выполнение операции нахождения всех постов в коллекции "posts"
//     const data = await Post.find().exec();
//     res.json(data); // Отправка данных на клиентскую сторону в формате JSON
//   } catch (error) {
//     console.error('Error retrieving posts:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });












