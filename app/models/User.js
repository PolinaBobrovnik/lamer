/**
 * Created by vittal on 20.7.16.
 */
var mongoose = require('mongoose');

var User = new mongoose.Schema({
    username: String,
    password: String,
    email: {type: String, default: ''},
    registration_date: {type: Date, default: Date.now},
    posted_comments_count: {type: Number, default: 0},
    posted_articles_count: {type: Number, default: 0}
});

mongoose.model('User', User);