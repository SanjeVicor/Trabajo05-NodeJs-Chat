var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('chatRoom')) {
    window.location = 'index.html';
    throw new Error('Name and chat room name are necessary');
}

var user = {
    name: params.get('name'),
    chatRoom: params.get('chatRoom')
}

if (user.name === "" || user.chatRoom === "") {
    window.location = 'index.html';
    throw new Error('Name and chat room name are necessary');
}


socket.on('connect', function() {
    console.log('Connected on server');

    socket.emit('enterChat', user, function(resp) {
        console.log('Active Users \n', resp);
        if (resp.error) {
            window.location = 'index.html';
            alert(resp.message)
            throw new Error(resp.message);
        }
        renderingUsers(resp)
    });
});


socket.on('updatedList', function(resp) {
    console.log('User list: ');
    console.log(resp);
    renderingUsers(resp)
});


//Mensaje grupal
socket.on('newMessage', function(resp) {
    //console.log('Server:  ', resp);
    renderingMessages(resp, false)
    scrollBottom()
});

//Mensaje privado
socket.on('privateMessage', function(message) {
    console.log('PRIVATE MESSAGE : ', message);
    renderingMessages(message, false)
    scrollBottom()
})