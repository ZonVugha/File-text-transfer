const express = require('express');
const exphbs = require('express-handlebars');

const config = require('./config.json');
const errorHandling = require('./api/errorHandling');

const app = express();
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
app.use('/api', require('./api/upload'));
app.use(errorHandling);
app.listen(config.server.post, () => {
    console.log(`server in running on ${config.server.post}`);
})