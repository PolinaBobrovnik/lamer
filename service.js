/**
 * Created by vittal on 20.7.16.
 */
var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data


var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var mongoose = require('mongoose');                         //add for Mongo support
mongoose.connect('mongodb://localhost/test-lamer');              //connect to Mongo

var session = require('express-session');
app.use(session({
    secret: 'keyboard cat'
}));

var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

require('./app/models/User.js');
require('./app/models/Article.js');

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

var authenticate = require('./app/routes/authenticate.js')(passport);
app.use('/', require('./app/routes/index.js'));
app.use('/auth', authenticate);
app.use('/articles', require('./app/routes/articleRoutes.js'));
app.use('/users', require('./app/routes/userRoutes.js'));


app.listen(28017, function () {
    console.log('app listening on port');
});