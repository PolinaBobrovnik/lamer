var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var User = mongoose.model('User');
var Article = mongoose.model('Article');

router.route('/:username')
    // not implemented case, when "username" is the name of current user
    .get(function (req, res, next) {
        User.findOne({username: req.params.username}, function (err, user) {
            if (err) {return next(err);}

            if (!user) {
                return next('cant GET user, dont find user');               
            }

            res.json({
                username: user.username,
                email: user.email,
                registration_date: user.registration_date
            });
        });
    })

    // implemented in authenticate.js
        
    // .post(function (req, res, next) {
    //     User.findOne({username: req.params.username}, function (err, user) {
    //         if (err) {return next(err);}
    //
    //         if (user) {
    //             return next('cant POST user, user already created');
    //         }
    //
    //         var newUser = new User();
    //         newUser.username = req.body.username;
    //         newUser.password = req.body.password;
    //         newUser.email = req.body.email;
    //         newUser.registration_date = req.body.registration_date;
    //         newUser.posted_comments_count = req.body.posted_comments_count;
    //         newUser.posted_articles_count = req.body.posted_articles_count;
    //         newUser.save(function (err) {
    //             if (err) {
    //                 console.log("cant save newUser\n");
    //                 return err;
    //             }
    //             console.log("newUser saved in db!");
    //         });
    //     });
    // })

    // IMPLEMENT username should be username of authorized user
    .put(function (req, res, next) {
        User.findOne({username: req.params.username}, function (err, user) {
            if (err) {return next(err);}
    
            if (!user) {
                return next('cant PUT user, user not exist');
            }

            user.username = req.body.username ? req.body.username : user.username;
            user.password = req.body.password ? req.body.password : user.password;
            user.email = req.body.email ? req.body.email : user.email;
            user.registration_date = req.body.registration_date ? req.body.registration_date
                                                                : user.registration_date;
            user.posted_comments_count = req.body.posted_comments_count ? req.body.posted_comments_count
                                                                        : user.posted_comments_count;
            user.posted_articles_count = req.body.posted_articles_count ? req.body.posted_articles_count
                                                                        : user.posted_articles_count;

            user.save(function (err, user) {
                if (err) {
                    console.log("cant save newUser\n");
                    return err;
                }
                res.json(user);
            });
        });
    })

    // IMPLEMENT username should be username of authorized user
    .delete(function (req, res, next) {
        User.remove({_id: req.params.username}, function (err) {
            if (err) {return err;}
            res.json('deleted');
        });
    });

module.exports = router;