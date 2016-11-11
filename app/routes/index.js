/**
 * Created by vittal on 22.7.16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

router.route('/')

    .get(function (req, res) {
        res.send('Hello world\n');
    });

module.exports = router;