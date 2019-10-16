const { io } = require('../server');
const { Users } = require('../classes/users')
const { createMessage } = require('../shortcuts/shortcuts')
const users = new Users()

io.on('connection', (client) => {

    client.on('enterChat', (user, callback) => {
        //console.log(user);
        if (!user.name || !user.chatRoom) {
            return callback({
                error: true,
                message: 'Name/chatRoom are necessary'
            });
        }

        client.join(user.chatRoom);
        users.addUser(client.id, user.name, user.chatRoom);

        client.broadcast.to(user.chatRoom).emit('updatedList', users.getGroupUsers(user.chatRoom));

        client.broadcast.to(user.chatRoom).emit('newMessage', createMessage('Admin', `${user.name} joined the chat room`));
        //console.log(activeUsers);
        if (callback)
            callback(users.getGroupUsers(user.chatRoom))
    });


    client.on('disconnect', () => {
        let usrDeleted = users.deleteUser(client.id);
        //console.log(usrDeleted);
        try {
            client.broadcast.to(usrDeleted.chatRoom).emit('newMessage', createMessage('Admin', `${usrDeleted.name} left the chat room`));
            client.broadcast.to(usrDeleted.chatRoom).emit('updatedList', users.getGroupUsers(usrDeleted.chatRoom));
        } catch {
            return;
        }
    });

    //Mensajes publicos (Grupales)
    client.on('newMessage', (data, callback) => {
        let user = users.getUser(client.id)
        let message = createMessage(user.name, data.message);
        client.broadcast.to(user.chatRoom).emit('newMessage', message);

        if (callback)
            callback(message)
    });

    //Mensajes privados
    client.on('privateMessage', data => {
        let fromUsr = users.getUser(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(fromUsr.name, data.message));
    });

});