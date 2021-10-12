const LocalStrategy = require('passport-local').Strategy

function initialize(passport, account, pwd) {
    passport.use('local', new LocalStrategy(
        function (username, password, done) {
            if (username === account && password === pwd) {
                return done(null, username);
            } else {
                return done(null, false, { "message": "User not found." });
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, 'isID');
    });
    passport.deserializeUser(function (id, done) {
        done(null, 'isUsername');
    });

}
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/index')
    }
    next()
}

module.exports = { initialize, checkAuthenticated, checkNotAuthenticated }
