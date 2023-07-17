function slowScroll(id) {
    $("html, body").animate({
        scrollTop: $(id).offset().top
    }, 500);
}

$(document).on("scroll", function () {
    if ($(window).scrollTop() === 0) {
        $("header").removeClass("fixed");
    } else {
        $("header").addClass("fixed");
    }
});



function sendTelegramMessage(name, url, message) {
    var telegramBotToken = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';
    var telegramChatId = '997616670';

    var telegramMessage = '\n' + name + ' ' + '\n' + url + ' ' + '\n' + message + '\n';

    $.ajax({
        url: 'https://api.telegram.org/bot' + telegramBotToken + '/sendMessage',
        method: 'POST',
        data: {
            chat_id: telegramChatId,
            text: telegramMessage
        },
        success: function (response) {
            console.log('Сообщение отправлено в Telegram');
        },
        error: function (error) {
            console.log('Ошибка при отправке сообщения в Telegram');
        }
    });
}

function handleLike(button) {
    var counter = button.nextElementSibling;
    var count = parseInt(counter.innerText) || 0;

    if (button.classList.contains("liked")) {
        counter.innerText = count - 1;
        button.classList.remove("liked");
        updateLikeCount(button.closest(".img").id, count - 1);

        var postId = button.closest(".img").id;
        var likedPosts = getLikedPostsFromLocalStorage();
        var index = likedPosts.indexOf(postId);
        if (index !== -1) {
            likedPosts.splice(index, 1);
            saveLikedPostsToLocalStorage(likedPosts);
        }
    } else {
        // Увеличиваем значение счетчика на 1 и обновляем его
        counter.innerText = count + 1;
        button.classList.add("liked");
        updateLikeCount(button.closest(".img").id, count + 1); // Обновляем значение счетчика лайков в localStorage

        // Сохраняем информацию о нажатии кнопки лайка в localStorage
        var postId = button.closest(".img").id;
        var likedPosts = getLikedPostsFromLocalStorage();
        likedPosts.push(postId);
        saveLikedPostsToLocalStorage(likedPosts);
    }
}

function savePostToLocalStorage(name, url, messageText, timestamp) {
    var posts = getPostsFromLocalStorage();

    var post = {
        id: Date.now().toString(), // id поста
        name: name, // имя автора
        url: url, // url поста
        messageText: messageText, // текст сообщения
        likes: 0, // количество лайков
        timestamp: timestamp // время публикации поста
    };

    posts.push(post);
    savePostsToLocalStorage(posts);
}


function updateLikeCount(postId, count) {
    var allPosts = getPostsFromLocalStorage();
    var postToUpdate = findPostById(allPosts, postId);
  
    if (postToUpdate) {
      postToUpdate.likes = count;
      savePostsToLocalStorage(allPosts);
    }
}

function findPostById(posts, postId) {
    return posts.find(function(post) {
      return post.id === postId;
    });
}

function getPostsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}

function savePostsToLocalStorage(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function getLikedPostsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('likedPosts')) || [];
}

function saveLikedPostsToLocalStorage(likedPosts) {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
}

function loadPostsFromLocalStorage() {
    var posts = getPostsFromLocalStorage();

    posts.sort(function(a, b) {
        return a.likes - b.likes;
    });

    var messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    posts.forEach(function(post) {
        var dateAndTime = formatTime(post.timestamp);

        var postHTML = `
        <div class="img" id="${post.id}">
            <img src="${post.url}" alt="">
            <span class="messageText">${post.messageText}</span>
            <div class="like-section">
                <button class="like-button${post.likes > 0 ? ' liked' : ''}" onclick="handleLike(this)">&#x2764;</button>
                <span class="like-counter">${post.likes}</span>
            </div>
            <div class="post-bottom">
                <span class="post-name">Переслано от ${post.name}</span>
                <span class="post-time">${dateAndTime}</span>
            </div>
        </div>
        `;

        messagesDiv.insertAdjacentHTML('afterbegin', postHTML);
    });
}

function formatTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var day = date.getDate();
    var month = date.getMonth() + 1;
  
    var formattedDateAndTime = day + '/' + month + ' ' + hours + ':' + minutes;
  
    return formattedDateAndTime;
}


// script.js

function loadPostsFromServer() {
    $.ajax({
      url: '/posts',
      method: 'GET',
      success: function (response) {
        response.forEach(function (post) {
          var dateAndTime = formatTime(post.timestamp);
  
          var postHTML = `
          <div class="img" id="${post.id}">
              <img src="${post.url}" alt="">
              <span class="messageText">${post.messageText}</span>
              <div class="like-section">
                  <button class="like-button${post.likes > 0 ? ' liked' : ''}" onclick="handleLike(this)">&#x2764;</button>
                  <span class="like-counter">${post.likes}</span>
              </div>
              <div class="post-bottom">
                  <span class="post-name">Переслано от ${post.name}</span>
                  <span class="post-time">${dateAndTime}</span>
              </div>
          </div>
          `;
  
          $('#messages').append(postHTML);
        });
      },
      error: function (error) {
        console.log('Ошибка при загрузке постов:', error);
      },
    });
  }
  
  $(document).ready(function () {
    loadPostsFromServer();
  });

function clearLocalStorage() {
    localStorage.removeItem('posts');
    localStorage.removeItem('likedPosts');
}

$('#mess_send').click(function () {
    var name = $('#name').val();
    var url = $('#url').val();
    var message = $('#messege').val();

    sendTelegramMessage(name, url, message);

    $('#name').val('');
    $('#url').val('');
    $('#messege').val('');
});

const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function(event) {
    const messageData = JSON.parse(event.data);
    const message = messageData.text;

    let name, url, messageText;

    if (messageData.reply_to_message) {
        const replyMessage = messageData.reply_to_message;
        const replyText = replyMessage.text;
        
        const regex = /([^ \n]+) \n([^ \n]+) \n([^]+)/;
        [, name, url, messageText] = replyText.match(regex);
    } else {
        const regex = /([^ \n]+) \n([^ \n]+) \n([^]+)/;
        [, name, url, messageText] = message.match(regex);
    }

    const messagesDiv = document.getElementById('messages');
    messagesDiv.insertAdjacentHTML('afterbegin', 
    `
    <div class="img">
        <img src="${url}" alt="">
        <span>${messageText}</span>
        <div class="like-section">
            <button class="like-button" onclick="handleLike(this)">&#x2764;</button>
            <span class="like-counter">0</span>
        </div>
        <div class="post-bottom">
            <span class="post-name">Переслано от ${name}</span>
            
            <span class="post-time">${formatTime(messageData.date)}</span>
        </div>
    </div>
    `);

    savePostToLocalStorage(name, url, messageText, messageData.date);
};

// function createPostElement(name, url, messageText, date) {
//     return `
//         <div class="img">
//             <img title="${name}" src="${url}" alt="">
//             <span>${messageText}</span>
//             <div class="like-section">
//                 <button class="like-button" onclick="handleLike(this)">&#x2764;</button>
//                 <span class="like-counter">0</span>
//             </div>
//             <div class="post-time">${formatTime(date)}</div>
//         </div>
//     `;
// }



window.onload = function() {
    loadPostsFromLocalStorage();
    //clearLocalStorage();
};