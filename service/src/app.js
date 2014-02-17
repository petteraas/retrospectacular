'use strict';

var routes = require('./routes'),
    express = require('express'),
    hal = require('express-hal'),
    api = express(),
    config = require('../config').Config;

api.use(express.methodOverride());
api.use(express.json());

api.use(hal.middleware);

routes.setup(api);

api.use(express.logger('dev'));

api.listen(config.app.port, config.app.host);
