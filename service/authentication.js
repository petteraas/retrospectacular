var passport = require('passport'),
    googleStrategy = require('passport-google').Strategy;

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
      profile.identifier = identifier;
      return done(null, profile);
    });
}));

exports.setup = function (api, express) {
    api.use(express.cookieParser());
    api.use(express.session({ secret: 'THIS IS A SECRET' }));

  // Initialize Passport! Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
    api.use(passport.initialize());
    api.use(passport.session());

    return passport;
};
