var config = require('../config').Config,

    kafka = require('kafka-node'),
    client = new kafka.Client(config.kafka.connectionString, config.kafka.clientId),

    Consumer = kafka.Consumer,
    consumer = new Consumer(
        client,
        [{
            topic: config.kafka.topic, partition: 0
        }]
    ),

    Producer = kafka.Producer,
    producer = new Producer(client),
    producerReady = false;

producer.on('ready', function () {
    producerReady = true;
});

producer.on('error', function (err) {
    console.log('producer error', err);
});

exports.sendMessage = function (type, action, message) {
    if (producerReady) {
        message.type = type;
        message.action = action;
        var payloads = [{
            topic: config.kafka.topic,
            messages: JSON.stringify(message)
        }];
        producer.send(payloads, function (err, data) {
            if (err) {
                console.log(err);
            }
            return data;
        });
    }
};

exports.consumer = consumer;
