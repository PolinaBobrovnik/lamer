/**
 * Created by vittal on 20.7.16.
 */
var mongoose = require('mongoose');

var Article = new mongoose.Schema({
    author_username: String,
    title: String,
    link: String,
    rating: {type: Number, default: 5},
    creation_date: {type: Date, default: Date.now},
    comments: [{
        author_username: String,
        text: String
    }]
});

mongoose.model('Article', Article);
