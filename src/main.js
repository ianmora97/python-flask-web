const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const app = express();
const mongo = require('./connections/mongo');
const bodyParser = require('body-parser');

// set env variables
app.set('port', 3000);
app.set('host', 'localhost');
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set engine
app.engine('.hbs', hbs.create({
        defaultLayout: 'base',
        layoutsDir: path.join(__dirname, '/views/layouts'),
        partialsDir: path.join(__dirname, '/views/partials'),
        extname: '.hbs',
    }).engine
);

// static files
app.use(express.static(path.join(__dirname, '/public')));

app.use(require('./index.routes'));

app.listen(app.get('port'), app.get('host'), () => {
    console.log(`Server running at http://${app.get('host')}:${app.get('port')}`);
});