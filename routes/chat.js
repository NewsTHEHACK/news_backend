var express = require('express');
var router = express.Router();

const http = require('http').Server(router);
const io = require('socket.io')(http);

const nameArray = ["lqy", "lwh", "zyf", "wds"];

let users = [];

router.get("/", (req, res) => {
   res.sendFile(__dirname + '/chat.index')
});

io.on('connection', (socket) => {
    let username = nameArray[Math.ceil(Math.random()*4)];
    socket.on('join', (data) => {
        users.push({username:username});
        data.username = username;
        socket.emit('joinSuccess', data);

        io.sockets.emit('add', data)

    });

    socket.on('disconnect', () => {
        users.map((val, index) => {
            if (val.username === username) {
                users.splice(index, 1)
            }
        })
    });

    socket.on('sendMessage', (data) => {
       io.sockets.emit('receiveMessage', data)
    });


});

