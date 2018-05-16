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
    $scope.quantity = {};
    // setInterval(() => {
    //     console.log('$scope.quantity', $scope.quantity);
    // }, 1000);

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
    $scope.newCient = {value: null};
    // $scope.quantity = {value: null};
    $scope.onAddNewClientClick = function (value) {
        $scope.clients.unshift({name: value, sum: 0});
    }
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

    $scope.handleCalculatePrice = function (quantity) {
        $http.post("/price", {
            data: {
                selectedItems: $scope.selectedItems.map((item, index) => {
                    let itemCopy = Object.assign({}, item);
                    itemCopy.quantity = quantity['item_' + index];
                    return itemCopy;
                }),
                client: $scope.clients[$scope.selectedIndex]
            }
        })
            .then(function (response) {
                $scope.total_price = response.data;
            });
    }    
});
