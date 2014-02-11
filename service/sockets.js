var consumer = require('./library/Kafka').consumer;

exports.setup = function(io) {
    io.sockets.on('connection', function (socket) {
        consumer.on('message', function (message) {
            console.log('message', message);
            socket.emit('message', { message: message });
        });
        socket.on('message', function (data) {
            console.log('received message', message);
        });
    });
};
