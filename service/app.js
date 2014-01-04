var routes = require('./routes'),
    express = require('express'),
    api = express(),
    config = require('./config').Config;

api.use(express.methodOverride());
api.use(express.json());

routes.setup(api,express);

api.use(express.logger('dev'));

api.use(express.static("../static/app"));
api.listen(config.app.port, config.app.host);

