const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const config = require('./config.json');
const errorHandling = require('./server/errorHandling');
const passport = require('passport');

const credentials = { key: fs.readFileSync(config.server.key, 'utf8'), cert: fs.readFileSync(config.server.cert, 'utf8') };

const initializePassport = require('./server/verify');
const { info } = require('console');
initializePassport.initialize(
    passport,
    config.private.username,
    config.private.password
)

let runServer;
if (config.server.https) {
    runServer = https.createServer(credentials, app);

} else {
    runServer = http.createServer(app);
}
const io = new Server(runServer, {

})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());

// app.use(express.static('./public'));
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
if (!config.private.useVerify) {
    app.use(express.static('./public'));
} else {
    app.get('/', initializePassport.checkAuthenticated, (req, res) => {
        res.redirect(302, '/index')
    });
    app.use(express.static('./public'))

    app.get('/login', initializePassport.checkNotAuthenticated, (req, res) => {
        // console.log(req.flash('error'));
        res.sendFile(__dirname + '/public/login.html');
    });

    app.get('/index', initializePassport.checkAuthenticated, (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    })
    app.post('/api/login',
        passport.authenticate('local', { successRedirect: '/index', failureRedirect: '/login', failureFlash: true }));
}

app.set('socketio', io);
app.use('/api', require('./server/routes'));
app.use(errorHandling);

runServer.listen(config.server.post, () => {
    console.log(`server in running on ${config.server.post}`);
})