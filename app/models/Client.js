var mongoose = require('mongoose');

var Client = new mongoose.Schema({
    name: String,
});

mongoose.model('Client', Client);
