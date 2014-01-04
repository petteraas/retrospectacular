var routes = require('./routes'),
    express = require('express'),
    api = express();

api.use(express.methodOverride());
api.use(express.json());

routes.setup(api,express);

api.use(express.logger('dev'));
api.use(express.static("../static/app"));
api.listen(3000);
