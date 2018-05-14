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
mongoose.connect('mongodb://localhost/price-calculator');              //connect to Mongo

var session = require('express-session');
app.use(session({
    secret: 'keyboard cat'
}));

// require('./app/models/User.js');
// require('./app/models/Article.js');
require('./app/models/Item.js');
require('./app/models/Client.js');

app.use('/', require('./app/routes/index.js'));

var ItemModel = mongoose.model('Item');

app.use('/items', (req, res) => {
    ItemModel.find({}, (err, items) => {
        res.send(items)
    })
});

// var clients = [{ name: "alex" }, { name: "oleg" }];
var ClientModel = mongoose.model('Client');

app.use('/clients', (req, res) => {
    ClientModel.find({}, (err, clients) => {
        res.send(clients);
    })
});

function calculator (length, obj) {
    return 100 * (length || 0);
}

// app.use('/price', (req, res) => {
//     res.send(JSON.stringify(calculator(10*100)));
// });

app.post('/price', (req, res) => {
    res.send(JSON.stringify(calculator(req.body.data.selectedItems.length)));
});
        
app.use('*', (req, res) => {
    res.send("not catched")
});
// app.use('/articles', require('./app/routes/articleRoutes.js'));
// app.use('/users', require('./app/routes/userRoutes.js'));


app.listen(28017, function () {
    console.log('app listening on port 28017');
});