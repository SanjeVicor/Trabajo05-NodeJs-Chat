const { io } = require('../server');
const { Users } = require('../classes/users')
const { createMessage } = require('../shortcuts/shortcuts')
const users = new Users()

io.on('connection', (client) => {



    client.on('enterChat', async(user, callback) => {
        console.log(users.getAllUsers());

        x = users.getAllUsers()
        let error = false
        await x.forEach(element => {
            if (element.name == user.name) {
                error = true
            }
        });

        if (error) {
            return callback({
                error: true,
                message: 'Name is already used'
            });
        }

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
    client.on('privateMessage', (data, callback) => {
        let fromUsr = users.getUser(client.id);
        let message = createMessage(fromUsr.name, data.message);
        client.broadcast.to(data.to).emit('privateMessage', message);
        if (callback)
            callback(message)
    });

});