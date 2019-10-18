var params = new URLSearchParams(window.location.search);
var userName = params.get('name');
var chatRoom = params.get('chatRoom');
//referencias de jquery
var divUsuers = $('#divUsuarios');
var formSend = $('#formEnviar');
var txtMessage = $('#txtMensaje');
var divChatbox = $('#divChatbox')
let usersList = []
    ///Funciones para renderizar usuarios

function renderingUsers(users) { //[{},{},{}]
    console.log(users);
    usersList = users
    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('chatRoom') + '</span></a>';
    html += '</li>';


    for (var i = 0; i < users.length; i++) {
        html += '<li>'
        html += '    <a data-id="' + users[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + users[i].name + ' <small class="text-success">online</small></span></a>'
        html += '</li>'
    }

    divUsuers.html(html)
}


function renderingMessages(message, me) {
    var html = '';
    var date = new Date(message.date)
    var hour = date.getHours() + ':' + date.getMinutes()

    var adminClass = 'info'

    if (message.name === 'Admin') {
        adminClass = 'danger';
    }

    if (me) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '            <h5>' + message.name + '</h5>';
        html += '            <div class="box bg-light-inverse">' + message.message + '</div> ';
        html += '        </div>';
        html += '        <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '   <div class="chat-time">' + hour + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        html += '    <div class="chat-content">';
        if (message.name !== 'Admin') {
            html += '        <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div> ';
        }
        html += '            <h5>' + message.name + '</h5>';
        html += '            <div class="box bg-light-' + adminClass + '">' + message.message + '</div> ';
        html += '        </div>';
        html += '   <div class="chat-time">' + hour + '</div>';
        html += '</li>';
    }



    divChatbox.append(html)
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


///LISTENERS
//a es la etiqueta html
divUsuers.on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }
})


function getUser(list) {

    let y = list[0].split(":")
    let usr = y[1]
    let username = ''

    username = usr.replace('+', ' ')
    for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].name == username) {
            return usersList[i]
        }
    }

    return false


}

formSend.on('submit', function(e) {
    e.preventDefault();
    if (txtMessage.val().trim().length === 0) {
        return
    }
    message = txtMessage.val()
    let x = message.split(" ")
    if (x[0].match("private:.+")) {
        console.log("PRIVADO")
        message = message.replace(x[0], '')
        let newMessage = "Private Message : " + message
        let userData = getUser(x)

        if (userData) {
            console.log(userData.id)
            socket.emit('privateMessage', {
                message: newMessage,
                to: userData.id
            }, function(message) {
                txtMessage.val('').focus()
                renderingMessages(message, true)
                scrollBottom()
            });
        }
    } else {

        socket.emit('newMessage', {
            name: userName,
            message: txtMessage.val()
        }, function(message) {
            txtMessage.val('').focus()
            renderingMessages(message, true)
            scrollBottom()
        });
    }
});