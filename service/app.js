var routes = require('./routes'),
    sockets = require('./sockets'),

    express = require('express'),
    api = express(),
    http = require('http'),
    server = http.createServer(api),

    io = require('socket.io').listen(server),

    config = require('./config').Config;

api.use(express.methodOverride());
api.use(express.json());

routes.setup(api);
sockets.setup(io);


api.use(express.logger('dev'));

server.listen(config.app.port, config.app.host);
