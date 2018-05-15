var mongoose = require('mongoose');

var Item = new mongoose.Schema({
    name: String,
    price: Number
});

mongoose.model('Item', Item);
