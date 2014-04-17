
var cluster = require('cluster'),
    os = require('os');

if (cluster.isMaster) {
    for (var i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
} else {
    var routes = require('./routes'),
        logs = require('./logs'),
        express = require('express'),
        api = express(),
        config = require('../config').Config;

    api.use(express.methodOverride());
    api.use(express.json());

    logs.setupLogger(api);

    routes.setup(api);

    logs.setupErrorLogger(api);

    api.listen(config.app.port, config.app.host);
}
