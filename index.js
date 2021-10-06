const express = require('express');
const exphbs = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config.json');
const errorHandling = require('./api/errorHandling');
const { download } = require('express/lib/response');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {

})
app.use(express.static('./public'));
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');
// app.use(cookieParser('secret'));
// app.use(session({ cookie: { maxAge: null } }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//     res.render('index', {
//         title: 'Upload file'
//     })
// });
app.set('socketio',io);
app.use('/api', require('./api/uploadApi'));
app.use(errorHandling);
httpServer.listen(config.server.post, () => {
    console.log(`server in running on ${config.server.post}`);
})