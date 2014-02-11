var config = require('../config').Config,

    kafka = require('kafka-node'),
    client = new kafka.Client(config.kafka.connectionString, config.kafka.clientId),

    Consumer = kafka.Consumer,
    consumer = new Consumer(
        client,
        [{
            topic: config.kafka.topic
        }],
        {
            autoCommit: false
        }
    ),

    Producer = kafka.Producer,
    producer = new Producer(client),
    producerReady = false;

client.on('ready', function() {
    console.log('kafka client ready');
});

client.on('error', function (err) {
    console.log('kafka client error', err);
});

consumer.on('error', function(err) {
    console.log('consumer error', err);
});

producer.on('ready', function () {
    producerReady = true;
});

producer.on('error', function (err) {
    console.log('producer error', err);
});

exports.sendMessage = function (type, action, message) {
    if (producerReady) {
        var payloads = [{
            topic: config.kafka.topic,
            messages: JSON.stringify({
                type: type,
                action: action,
                items: message
            })
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
