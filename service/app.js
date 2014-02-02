var authentication = require('./authentication'),
    routes = require('./routes'),
    express = require('express'),
    api = express(),
    config = require('./config').Config;

api.use(express.methodOverride());
api.use(express.json());

var passport = authentication.setup(api, express);

routes.setup(api, express, passport);

api.use(express.logger('dev'));

api.use(express.static("../static/app"));
api.listen(config.app.port, config.app.host);

