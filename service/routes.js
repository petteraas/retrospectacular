var retrospectives = require('./models/retrospectives'),
    tickets = require('./models/tickets'),

    allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        next();
    },
    auth = function(req, res, next) {
        if (!req.isAuthenticated())
            res.send(401);
        else
            next();
    };

exports.setup = function (api, express, passport) {
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

    api.get('/wordcloud', auth, tickets.getTicketWords);

    api.get('/auth/google', passport.authenticate('google'));
    api.get('/auth/google/return', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/login'}));
    api.get('/auth/logout', function (req, res) {
        req.logOut();
        res.send(200);
    });
    api.get('/auth/loggedin', function (req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });
};
