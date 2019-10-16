class Users { //Cambiar Users por ChatGroup

    constructor() {
        this.users = [];
    }

    addUser(id, name, chatRoom) {
        let user = { id, name, chatRoom };
        this.users.push(user);
        return this.users;
    }

    getUser(id) {
        let user = this.users.filter(usr => usr.id === id)[0]; //Un solo registro
        return user;
    }

    getAllUsers() {
        return this.users;
    }

    getGroupUsers(group) {
        let usersInGroup = this.users.filter(usr => usr.chatRoom === group);
        return usersInGroup
    }

    deleteUser(id) {
        let usr = this.getUser(id);

        this.users = this.users.filter(user => {
            return user.id != id;
        }); ///Retorna un nuevo arreglo con todas las personas activas en el chat o que no tengan el id buscado

        return usr;
    }
}

module.exports = {
    Users
}