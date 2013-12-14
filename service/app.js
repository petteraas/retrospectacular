var routes = require('./routes'),
    express = require('express'),
    swagger = require('swagger-node-express'),
    api = express();

api.use(express.methodOverride());
api.use(express.json());

swagger.setAppHandler(api);

routes.setup(api);

api.use(express.logger('dev'));

api.listen(3000);
