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

require('./app/models/Item.js');

var ItemModel = mongoose.model('Item');

app.use('/items', (req, res) => {
    ItemModel.find({}, (err, items) => {
        res.send(items)
    })
});

function calculator (data) {
    let priceWithoutDiscount = 0;
    let totalDiscount = 0;
    data.selectedItems.map( function(item) {
        let price = item.fixedCost + item.variableCost + item.profit;
        priceWithoutDiscount += price*item.quantity;
        let discount = ((item.quantity * ( item.profit + (( item.fixedCost + item.variableCost )*( 1-( item.variableCost / (item.fixedCost + item.variableCost))))))/(item.quantity+1)).toFixed(2);
        totalDiscount += +discount; 
    });
    let price = (priceWithoutDiscount-totalDiscount).toFixed(2);
    const allData = {totalDiscount: totalDiscount.toFixed(2), price: price};
    return allData;
}

app.post('/price', (req, res) => {
    res.send(JSON.stringify(calculator(req.body.data)));
});

app.post('/newItem', (req, res) => {
    ItemModel.create(req.body.data.item);
    res.send("Ok");
});
        
app.use('*', (req, res) => {
    res.send("not catched")
});

app.listen(28017, function () {
    console.log('app listening on port 28017');
});