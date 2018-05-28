var mongoose = require('mongoose');
var Item = new mongoose.Schema({
    name: String,
    variableCost: Number,
    fixedCost: Number,
    profit: Number
});
mongoose.model('Item', Item);
