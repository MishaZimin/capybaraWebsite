// client.js
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


// function loadPostsFromServer() {
//     $.ajax({
//       url: '/notes',
//       method: 'GET',
//       success: function (response) {
//         var posts = JSON.parse(response);
//         // Обработка полученных данных
//         posts.forEach(function(post) {
//             var dateAndTime = formatTime(post.timestamp);
    
//             var postHTML = `
//             <div class="img" id="${post.id}">
//                 <img src="${post.url}" alt="">
//                 <span class="messageText">${post.messageText}</span>
//                 <div class="like-section">
//                     <button class="like-button${post.likes > 0 ? ' liked' : ''}" onclick="handleLike(this)">&#x2764;</button>
//                     <span class="like-counter">${post.likes}</span>
//                 </div>
//                 <div class="post-bottom">
//                     <span class="post-name">Переслано от ${post.name}</span>
//                     <span class="post-time">${dateAndTime}</span>
//                 </div>
//             </div>
//             `;
    
//             messagesDiv.insertAdjacentHTML('afterbegin', postHTML);
//         });
//       },
//       error: function (error) {
//         console.log('Ошибка при загрузке постов:', error.statusText);
//       },
//     });
//   }
  
//   $(document).ready(function () {
//     loadPostsFromServer();
//   });

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
    loadPostsFromLocalStorage();
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
            <img class="post-img" src="${post.url}" alt="">
            <span class="messageText">${post.messageText}</span>
            <div class="like-section">
                <button class="like-button${post.likes > 0 ? ' liked' : ''}" onclick="handleLike(this)">&#x2764;</button>
                <span class="like-counter">${post.likes}</span>
            </div>
            <div class="post-bottom">
                <span class="post-name">от: <b>${post.name}</b></span>
                <span class="post-time">${dateAndTime}</span>
            </div>

            <div class="comments">              
                <button class="collapse-button" onclick="toggleComments(${post.id})">Комментарии</button><br>
                <div class="comment-list" id="comments-${post.id}">
                    <!-- здесь будут комментарии -->
                </div>
                <div class="add-comment">
                    <input type="text-comment" id="comment-input-${post.id}" placeholder="Ваш комментарий">
                    
                    <button onclick="clearComments(${post.id})">             
                        &#10006;              
                    </button>

                    <button onclick="addComment(${post.id})">
                        
                        &#10095; 
                    </button>
                </div>
            </div>
        </div>
        `;

        messagesDiv.insertAdjacentHTML('afterbegin', postHTML);
        //loadCommentsFromLocalStorage(post.id); // Загружаем комментарии для данного поста
    });
}

function clearComments(postId) {
    var commentsDiv = document.getElementById(`comments-${postId}`);
    commentsDiv.innerHTML = ''; // Очищаем отображение комментариев

    // Удаляем комментарии из локального хранилища
    saveCommentsToLocalStorage(postId, []);
}

function toggleComments(postId) {
    var commentsDiv = document.getElementById(`comments-${postId}`);
    var addCommentDiv = document.querySelector(`#comments-${postId} .add-comment`);

    if (commentsDiv.style.display === 'none' || commentsDiv.style.display === '') {
        // Комментарии еще не отображены, загружаем и показываем
        commentsDiv.innerHTML = ''; // Сначала очистим содержимое, чтобы избежать дублирования комментариев при повторных кликах
        loadCommentsFromLocalStorage(postId);

        commentsDiv.style.display = 'block';
        addCommentDiv.style.display = 'block';
    } else {
        // Комментарии уже отображены, скрываем их
        commentsDiv.style.display = 'none';
        addCommentDiv.style.display = 'none';
    }
}


// Функция добавления комментария
function addComment(postId) {
    var commentInput = document.getElementById(`comment-input-${postId}`);
    var commentText = commentInput.value.trim();
    if (!commentText) {
        alert('Пожалуйста, введите комментарий.');
        return;
    }

    var avatarUrls = [
        'https://avatars.mds.yandex.net/i?id=cde779dc1051c473acd14df966bc038f9a42fccf-8076535-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=e59519547ca3227798a2638fe587cbb80951a970-9181363-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=c3774dd0d3b48ce898170876d05252adb2f92b33-8901029-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=263c28e8d8eceea70895c904f880e212b64928c2-8294270-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=78d4ed45fafe9f6cedb2934f0fcc938cd1d52a20-9050759-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=22efaaa843cb7bb474908ebac7158661425bca3e-9065974-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=8d20c0d271e9053a2ca62b412c4a8dc56cc6515f-5246350-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=446edff486f12589defc380337cedb73969b09d3-9589172-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=4048803598b8161035afd54a2222509fa398a7c9-8427413-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=edae7179de7094050a8f791949a7c6856aadc8e7-9699538-images-thumbs&n=13',

    ];

    var randomIndex = Math.floor(Math.random() * avatarUrls.length);
    var randomAvatarUrl = avatarUrls[randomIndex];

    var comments = getCommentsFromLocalStorage(postId);
    var commentId = Date.now().toString(); // Уникальный id для комментария

    var comment = {
        id: commentId,
        text: commentText,
        avatar: randomAvatarUrl // Сохраняем случайно выбранный URL аватара в объект комментария
    };

    comments.push(comment);
    saveCommentsToLocalStorage(postId, comments);

    // Очищаем поле ввода комментария
    commentInput.value = '';

    // Обновляем список комментариев на странице
    loadCommentsFromLocalStorage(postId);
}

function getAvatarImage(avatarUrl) {
    return `<img src="${avatarUrl}" alt="Avatar">`;
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

function clearLocalStorage() {
    localStorage.removeItem('posts');
    localStorage.removeItem('likedPosts');
}



function getCommentsFromLocalStorage(postId) {
    var commentsKey = `comments_${postId}`;
    return JSON.parse(localStorage.getItem(commentsKey)) || [];
}

function saveCommentsToLocalStorage(postId, comments) {
    var commentsKey = `comments_${postId}`;
    localStorage.setItem(commentsKey, JSON.stringify(comments));
}

function loadCommentsFromLocalStorage(postId) {
    var comments = getCommentsFromLocalStorage(postId);
    var commentsDiv = document.getElementById(`comments-${postId}`);
    var addCommentDiv = document.querySelector(`#comments-${postId} .add-comment`);

    commentsDiv.innerHTML = '';

    comments.forEach(function(comment) {
        var commentHTML = `
            <div class="comment" id="comment-${comment.id}">
                <div class="avatar">
                    <img src="${comment.avatar}" alt="Avatar">
                </div>
                <span>${comment.text}</span>
            </div>
        `;
        commentsDiv.insertAdjacentHTML('beforeend', commentHTML);
    });

    // Показываем контейнер для комментариев
    commentsDiv.style.display = 'block';

    // Показываем форму для добавления комментария
    addCommentDiv.style.display = 'block';
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

    const regex = /([^ \n]+) \n([^ \n]+) \n([^]+)/;
    if (messageData.reply_to_message) {
        const replyMessage = messageData.reply_to_message;
        const replyText = replyMessage.text;       
        
        [, name, url, messageText] = replyText.match(regex);
    } else {
        const matchResult = message.match(regex);
        if (matchResult) {
        [, name, url, messageText] = matchResult;
    }}

    savePostToLocalStorage(name, url, messageText, messageData.date);
    loadPostsFromLocalStorage();
};

window.onload = function() {
    loadPostsFromLocalStorage();
    //clearLocalStorage();
}