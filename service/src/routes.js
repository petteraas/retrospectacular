'use strict';

var _ = require('lodash'),
    retrospectives = require('./models/retrospectives'),
    tickets = require('./models/tickets'),
    users = require('./models/users'),
    config = require('../config').Config,
    db = require('./wrapper'),

    allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        next();
    },
    passport = require('passport'),
    googleStrategy = require('passport-google').Strategy,
    auth = function(req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing. However, since this example does not
// have a database of user records, the complete Google profile is serialized
// and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new googleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
}, function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.

        users.getUserByName(profile.displayName)
          .then(function (user) {
            if (_.isUndefined(user)) {
              db.post(profile).ofType('user').into(config.db.index)
                .then(function (response) {
                  console.log('post response: ', response);
                  return done(null, response);
                })
                .fail(function (err) {
                  console.log('post err: ', err);
                });
            } else {
              console.log('found user: ', user);
              return done(null, user);
            }
          })
          .fail(function (err) {
            console.log('getUserByName err', err);
          });
    });
}));


exports.setup = function (api, express) {
    var RedisStore = require('connect-redis')(express),
        redis = require('redis').createClient(config.redis.port, config.redis.host);

    api.use(express.cookieParser());
    api.use(express.session({
      secret: 'THIS IS A SECRET',
      store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        client: redis
      })
    }));
  // Initialize Passport! Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
    api.use(passport.initialize());
    api.use(passport.session());
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

    api.get('/auth/profile', function (req, res) {
      res.json(req.session);
    });

};
