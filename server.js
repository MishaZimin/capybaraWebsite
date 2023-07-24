
//node "C:\Users\Зимин Михаил\OneDrive\Рабочий стол\hello world\capybaraWebsite\server.js"
// const TelegramBot = require('node-telegram-bot-api');
// const WebSocket = require('ws');
// const fs = require('fs');

// const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';

// const bot = new TelegramBot(token, { polling: true });

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', (ws) => {
//   console.log('Установлено новое WebSocket соединение');

//   // Возможно, вы захотите отправить клиенту существующие посты сразу после подключения
//   // Вы можете использовать функцию send() на объекте ws для отправки данных клиенту

//   // Пример: отправка всех существующих постов из локального хранилища
//   const posts = getPostsFromLocalStorage(); // Замените эту функцию на вашу функцию для получения постов из локального хранилища
//   const postsData = JSON.stringify(posts);
//   ws.send(postsData);

//   ws.on('message', (message) => {
//     console.log('Получено сообщение из WebSocket:', message);

//     // Вам нужно обработать полученное сообщение от клиента
//     // Например, если вы хотите добавить новый пост от клиента
//     // Парсите сообщение и сохраняйте пост в локальное хранилище с помощью функции savePostToLocalStorage()

//     // Пример:
//     const post = JSON.parse(message);
//     savePostToLocalStorage(post.name, post.url, post.messageText, Date.now()); // Замените этот вызов на вашу функцию сохранения поста
//     // Опционально, отправьте новый пост всем клиентам, чтобы они обновили свои страницы
//     notifyClientsAboutNewPost(post);
//   });
// });

// bot.on('message', (msg) => {
//     const messageData = msg;
//     console.log('Получено сообщение:', messageData);

//     // Вам нужно обработать полученное сообщение от телеграм-бота
//     // Парсите сообщение и сохраняйте пост в локальное хранилище с помощью функции savePostToLocalStorage()
//     const message = messageData.text;

//     let name, url, messageText;

//     const regex = /([^ \n]+) \n([^ \n]+) \n([^]+)/;
//     if (messageData.reply_to_message) {
//         const replyMessage = messageData.reply_to_message;
//         const replyText = replyMessage.text;       
        
//         [, name, url, messageText] = replyText.match(regex);
//     } else {
//         const matchResult = message.match(regex);
//         if (matchResult) {
//         [, name, url, messageText] = matchResult;
//     }}

//     // Пример:

//     savePostToLocalStorage(name, url, messageText, Date.now()); // Замените этот вызов на вашу функцию сохранения поста

//     // Опционально, отправьте новый пост всем клиентам, чтобы они обновили свои страницы
//     notifyClientsAboutNewPost({ name, url, messageText });

//     bot.sendMessage(msg.chat.id, 'Получено');
// });

// // Ваш код для функций savePostToLocalStorage() и getPostsFromLocalStorage() здесь

// // Функция, которая сохраняет пост в локальное хранилище
// function savePostToLocalStorage(name, url, messageText, timestamp) {
//   var posts = getPostsFromLocalStorage();

//   var post = {
//     id: Date.now().toString(), // id поста
//     name: name, // имя автора
//     url: url, // url поста
//     messageText: messageText, // текст сообщения
//     likes: 0, // количество лайков
//     timestamp: timestamp // время публикации поста
//   };

//   posts.push(post);
//   savePostsToLocalStorage(posts);
// }


// // Функция, которая возвращает все посты из локального хранилища
// function getPostsFromLocalStorage() {
//   try {
//     const data = fs.readFileSync('posts.json', 'utf8');
//     return JSON.parse(data) || [];
//   } catch (error) {
//     return [];
//   }
// }

// // Функция, которая отправляет новый пост всем клиентам через WebSocket
// function notifyClientsAboutNewPost(post) {
//   const postData = JSON.stringify(post);
//   wss.clients.forEach((client) => {
//     client.send(postData, (error) => {
//       if (error) {
//         console.error('Ошибка при отправке сообщения клиенту:', error);
//       } else {
//         console.log('Сообщение успешно доставлено клиенту');
//       }
//     });
//   });
// }




// const express = require('express');
// const mongoose = require('mongoose');

// Замените <connection-string> на вашу строку подключения MongoDB Atlas
//const connectionString = 'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/';


{  
const TelegramBot = require('node-telegram-bot-api');
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
});
}

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












