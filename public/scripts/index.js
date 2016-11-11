/**
 * Created by vittal on 28.7.16.
 */
var app = angular.module('app', ['ngRoute', 'ngResource']).run(function ($rootScope, $http) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    
    $rootScope.signout = function(){
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };
});

app.config (function ($routeProvider) {
    $routeProvider
    //the timeline display
        .when('/', {
            templateUrl: 'routes/main.html',
            controller: 'mainController'
        })
        //the login display
        .when('/login', {
            templateUrl: 'routes/login.html',
            controller: 'authController'
        })
        //the signup display
        .when('/register', {
            templateUrl: 'routes/register.html',
            controller: 'authController'
        });
});

app.factory('postService', function($http, $resource){
     return $resource('/articles/');
});

app.factory('getArticlesService', function ($http, $resource) {
    return $resource('articles/0/10?top');
});

app.factory('updateArticle', function ($http, $resource) {
    return $resource('/articles/:id', null, {
        'update': {method: 'PUT'}
    });
});

app.controller('mainController', function(updateArticle, postService, getArticlesService, $scope, $rootScope){
    $scope.articles = getArticlesService.query();
    $scope.newArticle = {author_username: '', creation_date: '', title: '', link: ''};
    
    $scope.post = function() {
        $scope.newArticle.author_username = $rootScope.current_user;
        $scope.newArticle.creation_date = Date.now();
        postService.save($scope.newArticle, function(){
            $scope.articles = getArticlesService.query();
            $scope.articles.push($scope.newArticle);
            $scope.newArticle = {author_username: '', creation_date: '', title: '', link: ''};
        });
    };

    $scope.newComment = {author_username: $rootScope.current_user, text: ''};
    $scope.postComment = function (article) {
        article.comments.push($scope.newComment);
        updateArticle.update({id: article._id}, article, function () {
            $scope.newComment = {author_username: $rootScope.current_user, text: ''};
        });
    }
});

app.controller ('authController', function ($scope, $http, $rootScope, $location) {
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';
    
    $scope.register = function () {
        $http.post('/auth/signup', $scope.user).success(function (data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };
    
    $scope.login = function () {
        $http.post('/auth/login', $scope.user).success(function(data){
            if(data.state == 'success'){
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            }
            else{
                $scope.error_message = data.message;
            }
        });  
    }
});