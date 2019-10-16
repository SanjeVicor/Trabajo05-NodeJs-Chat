const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io'); 

const app = express();

let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
module.exports.io = socketIO(server)
require('./sockets/socket');

server.listen(port, (error) => {
    if (error) {
        throw new Error(error)
    }

    console.log(`Listening through port ${port}`);
});