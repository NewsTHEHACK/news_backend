
let socketio = {};
let socket_io = require('socket.io');

//��ȡio
socketio.getSocketio = function(server){

    var io = socket_io.listen(server);

};

module.exports = socketio;
