var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if(req.method === "GET"){
        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
}

router.use('/', isAuthenticated);

var User = mongoose.model('User');
var Article = mongoose.model('Article');

router.route('/random')

    .get(function (req, res) {
        Article.find({}, function (err, articles) {
            res.send('articles \n [ \n' + articles + '\n ]\n');
            //console.log(articles);
        });
    });

router.route('/')

    .post(upload.array(), function (req, res) {
        console.log(req.body);
        var newArticle = new Article();
        newArticle.author_username = req.body.author_username;
        newArticle.title = req.body.title;
        newArticle.link = req.body.link;
        newArticle.comments = req.body.comments;
        newArticle.save(function (err) {
            if (err) {
                console.log("cant save newArticle\n");
                return err;
            }
            console.log("newArticle saved in db!");
        });
        res.send(req.body);
    });

router.route('/:startIndex/:count')
    // NOT IMPLEMENTED
    .get(function (req, res) {
        // req.query
        // req.params
        
        for (var sort in req.query) {
            var sortCoef = ((sort == 'top') ? -1 : undefined) || ((sort == 'latest') ? 1 : undefined);
        }

        if (!sortCoef) {
            res.send("INCORRECT QUERY!");
        }
        
        Article.find({}, function (err, articles) {
            if (err) { return err; }

            articles.sort(function (article1, article2) {
                return sortCoef * (article1.creation_date - article2.creation_date);
            });
            
            res.send(articles.splice(req.params.startIndex, req.params.count));
        });
    });

router.route('/:id')

    .put(function (req, res) {
        //res.send(req.params.id);
        Article.findById(req.params.id, function (err, article) {
            if (err) {return err;}

            article.author_username = req.body.author_username;
            article.title = req.body.title;
            article.link = req.body.link;
            article.comments = req.body.comments;
            article.save(function (err, article) {
                if (err) {return err;}

                res.json(article);
            });
        });
    });

router.route('/:id')

    .delete(function (req, res) {
        Article.remove({_id: req.params.id}, function (err) {
            if (err) {return err;}
            res.json('deleted');
        });
    });

module.exports = router;