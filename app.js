const express = require('express');
const exphbs = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config.json');
const errorHandling = require('./server/errorHandling');
const { download } = require('express/lib/response');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {

})
app.use(express.static('./public'));
app.use(express.static('./savaFile'));
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('socketio', io);
app.use('/api', require('./server/routes'));
app.use(errorHandling);
httpServer.listen(config.server.post, () => {
    console.log(`server in running on ${config.server.post}`);
})