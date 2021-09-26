const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const config = require('./config.json');
const res = require('express/lib/response');

const msg = require('./upload');

const post = 8089;

const app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: null } }))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Upload file'
    })
});

app.use('/api/upload', require('./upload'));

app.listen(config.server.post, () => {
    console.log(`server in running on ${config.server.post}`);
})