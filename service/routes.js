var passport = require('passport'),
    GoogleStrategy = require('passport-google').Strategy,
    config = require('./config').Config,
    retrospectives = require('./models/retrospectives'),
    users = require('./models/user'),
    tickets = require('./models/tickets'),

    allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        next();
    };

passport.use(new GoogleStrategy({
    returnUrl: 'https://' + config.app.host + ':' + config.app.port + '/auth/google/return',
    realm: 'https://' + config.app.host + ':' + config.app.port + '/'
}, function (identifier, profile, done) {
    users.findOrCreate({ openId: identifier }, function (err, user) {
        done(err, user);
    });
}));

exports.setup = function (api) {
    api.use(allowCrossDomain);

    api.get('/retrospectives', retrospectives.getRetrospectives);
    api.get('/retrospectives/:retroId', retrospectives.getRetrospective);
    api.put('/retrospectives/:retroId', retrospectives.putRetrospective);
    api.post('/retrospectives', retrospectives.postRetrospective);
    api.delete('/retrospectives/:retroId', retrospectives.deleteRetrospective);

    api.get('/retrospectives/:retroId/tickets', tickets.getTickets);
    api.get('/retrospectives/:retroId/tickets/:ticketId', tickets.getTicket);
    api.put('/retrospectives/:retroId/tickets/:ticketId', tickets.putTicket);
    api.post('/retrospectives/:retroId/tickets', tickets.postTicketToRetrospective);
    api.delete('/retrospectives/:retroId/tickets/:ticketId', tickets.deleteTicket);

    api.get('/wordcloud', tickets.getTicketWords);

    api.get('/auth/google', passport.authenticate('google'));
    api.get('/auth/google/return', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

};
