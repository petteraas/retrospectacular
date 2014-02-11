var consumer = require('./library/Kafka').consumer,
    config = require('./config').Config;

exports.setup = function(io) {
    io.configure('production', function () {
        io.set('log level', 1);
    });

    io.configure('development', function () {
        io.set('log level', 2);
    });

    io.sockets.on('connection', function (socket) {
        console.log('got a visitor');

        // @FIXME: Figure out why this needs to be here even though the
        // action happens in the .on('message' call further down
        // 
        consumer.fetch({
            topic: config.kafka.topic,
            partition: '0',
            time: Date.now(),
            maxNum: 1
        }, function(err, data) {
            console.log('err',err);
            console.log('data', data);
        });

        consumer.on('message', function (message) {
            socket.emit('message', { message: message.value });
        });
    });
};
