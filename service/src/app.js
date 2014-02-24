var routes = require('./routes'),
    winston = require('winston'),
    express = require('express'),
    api = express(),
    config = require('../config').Config;

require('winston-logstash');



winston.add(winston.transports.Logstash, {
    port: config.logstash.port,
    host: config.logstash.host,
    node_name: config.logstash.node_name,
    silent: false
});

var winstonStream = {
        write: function (message) {
            winston.log('info', message, {
                'access_log': 'true'
            });
        }
    };

api.use(express.logger({
    stream: winstonStream
}));

api.use(express.methodOverride());
api.use(express.json());

routes.setup(api);

//api.use(express.logger('dev'));

api.listen(config.app.port, config.app.host);
