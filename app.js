const express = require('express');
const fs = require('fs');
const exphbs = require('express-handlebars');
// const { createServer } = require('https');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const config = require('./config.json');
const errorHandling = require('./server/errorHandling');
const { download } = require('express/lib/response');

const credentials = { key: fs.readFileSync('server.key', 'utf8'), cert: fs.readFileSync('server.cert', 'utf8') };
const app = express();
let runServer;
if (config.server.https) {
    runServer = https.createServer(credentials, app);

} else {
    runServer = http.createServer(app);
}
const io = new Server(runServer, {

})
app.get('/', (req, res) => {
    res.redirect(302, '/index')
});

// app.use(express.static('./public'));
app.use('/index', express.static('./public'))
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('socketio', io);
app.use('/api', require('./server/routes'));
app.use(errorHandling);

runServer.listen(config.server.post, () => {
    console.log(`server in running on ${config.server.post}`);
})