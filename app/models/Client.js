var mongoose = require('mongoose');

var Client = new mongoose.Schema({
    name: String,
    sum: Number
});

mongoose.model('Client', Client);
