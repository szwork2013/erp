var pricesApp = angular.module('PricesApp', ['ngRoute', 'ui.bootstrap', 'appServices']);

pricesApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/prices', {
                controller: 'PricesOverviewController',
                templateUrl: 'prices/prices/overview.partial.html'
            })
            .when('/calculations', {
                controller: 'CalculationsOverviewController',
                templateUrl: 'prices/calculations/overview.partial.html'
            })
            .when('/calculations/create', {
                controller: 'CreateCalculationController',
                templateUrl: 'prices/calculations/create.partial.html'
            })
            .otherwise({ redirectTo: '/prices' });
    }
]);

pricesApp.controller('PricesOverviewController', [
    '$scope',
    '$prices',
    function ($scope, $prices) {
        $scope.editMode = false;

        $scope.createPrice = function () {
            if (!$scope.editMode) {
                $scope.editMode = 'create';
                $scope.price = {};
            }
        }

        $scope.editPrice = function (priceToEdit) {
            if (!$scope.editMode) {
                $scope.editMode = 'edit';
                $scope.price = angular.copy(priceToEdit);
            }
        }

        $scope.savePrice = function () {
            var price = angular.copy($scope.price);
            var p;
            if (!price._id) {
                p = $prices.createPrice(price.name, price.unit, price.price);
            }
            else {
                p = $prices.updatePrice(price._id, price.name, price.unit, price.price);
            }

            p.then(function () { $scope.cancelEdit(); reloadPrices(); }, function (err) { alert('fout: ' + err); });
        }

        $scope.cancelEdit = function () {
            $scope.editMode = false;
            $scope.price = null;
        }

        function reloadPrices() {
            $prices.findPrices().then(function (prices) {
                $scope.prices = prices;
            });
        }

        reloadPrices();
    }
]);

pricesApp.controller('CalculationsOverviewController', [
    '$scope',
    function ($scope) {

    }
])