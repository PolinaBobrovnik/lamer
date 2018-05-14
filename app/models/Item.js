var mongoose = require('mongoose');

var Item = new mongoose.Schema({
    name: String,
});

mongoose.model('Item', Item);
