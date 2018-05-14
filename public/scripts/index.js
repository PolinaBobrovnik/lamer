/**
 * Created by vittal on 28.7.16.
 */
var app = angular.module('app', ['ngRoute', 'ngResource']).run(function ($rootScope, $http) {

});

app.config (function ($routeProvider) {
    $routeProvider
    //the timeline display
        .when('/', {
            templateUrl: 'routes/main.html',
            controller: 'mainController'
        })
        .otherwise("/")
});

app.controller('mainController', function ($scope, $rootScope, $http){
    $scope.items = [];
    $scope.selectedItems = [];
    $scope.selectedItemsIds = [];
    $scope.onItemClick = function (item) {
        let index = $scope.selectedItems.map(item => item._id).indexOf(item._id);
        if (index === -1) {
            $scope.selectedItems.push(item);
        } else {
            $scope.selectedItems.splice(index, 1);
        }
        $scope.selectedItemsIds = $scope.selectedItems.map(item => item._id);
    }
    $http.get("/items")
        .then(function (response) {
            $scope.items = response.data;
        });

    $scope.clients = [];
    $scope.selectedIndex = null;
    $scope.onClientClick = function (clientIndex) {
        $scope.selectedIndex = clientIndex;
    }
    $http.get("/clients")
        .then(function (response) {
            $scope.clients = response.data;
        }); 

    $scope.total_price = 0;   
    $http.post("/price", {
        data: {
            selectedItems: $scope.selectedItems,
            client: $scope.clients[$scope.selectedIndex]
        }
    })
        .then(function (response) {
            $scope.total_price = response.data;
        });  

    $scope.handleCalculatePrice = function (event) {
        $http.post("/price", {
            data: {
                selectedItems: $scope.selectedItems,
                client: $scope.clients[$scope.selectedIndex]
            }
        })
            .then(function (response) {
                $scope.total_price = response.data;
            });
    }    
});
