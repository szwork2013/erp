var pricesApp = angular.module('PricesApp', ['ngRoute', 'ui.bootstrap', 'appServices']);

pricesApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/prices', {
                controller: 'PricesOverviewController',
                templateUrl: 'prices/prices/overview.partial.html'
            })
            .otherwise({ redirectTo: '/prices' });
    }
]);

    pricesApp.controller('PricesOverviewController', [
    '$scope',
    '$prices',
    function ($scope, $prices) {
        $prices.findPrices().then(function (prices) {
            $scope.prices = prices;
        });
    }
]);