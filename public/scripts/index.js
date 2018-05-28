var app = angular.module('app', ['ngRoute', 'ngResource']).run(function ($rootScope, $http) {

});

app.config (function ($routeProvider) {
    $routeProvider
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

        var modal = document.getElementById('myModal');

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");
        
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        
        // When the user clicks on the button, open the modal 
        btn.onclick = function() {
            modal.style.display = "block";
        }
        
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
      
    $scope.clients = [];
    $scope.newCient = {value: null};
    $scope.newItem = {value: null};
    $scope.onAddNewClientClick = function (value) {
        $scope.clients.unshift({name: value.name, sum: value.sum});
    }

    $scope.onAddNewItemClick = function (value) {
        const newItem = {name: value.name, variableCost: value.varCost, fixedCost: value.fixedCost, profit: value.profit};

        $http.post("/newItem", {
            data: {
               item: newItem
            }
        }).then( v => {
                console.log(v); 
                $http.get("/items")
                .then(function (response) {
                    console.log(response.data);
                        $scope.items = response.data;
                    });
                }
            );
        modal.style.display = "none";
        $scope.newItem = {value: null};
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
    $scope.total_sale = 0;   
    $http.post("/price", {
        data: {
            selectedItems: $scope.selectedItems,
            client: $scope.clients[$scope.selectedIndex]
        }
    })
        .then(function (response) {
            $scope.total_price = response.data.price;
            $scope.total_sale = response.data.totalDiscount;
        });  

    $scope.handleCalculatePrice = function (quantity) {
        $http.post("/price", {
            data: {
                selectedItems: $scope.selectedItems.map((item) => {
                    let index = $scope.items.map(sIt => sIt._id).indexOf(item._id);
                    let itemCopy = Object.assign({}, item);
                    itemCopy.quantity = quantity['item_' + index];
                    return itemCopy;
                })
            }
        })
            .then(function (response) {
                $scope.total_price = response.data.price;
                $scope.total_sale = response.data.totalDiscount;
            });
    }   
    
});

