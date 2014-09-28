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
                templateUrl: 'prices/calculations/edit.partial.html'
            })
            .when('/calculations/:calculationId', {
                controller: 'EditCalculationController',
                templateUrl: 'prices/calculations/edit.partial.html'
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
    '$priceCalculations',
    function ($scope, $priceCalculations) {
        $priceCalculations.findCalculations().then(function (calculations) {
            $scope.calculations = calculations;
        });
    }
]);

pricesApp.controller('CreateCalculationController', [
    '$scope',
    '$priceCalculations',
    function ($scope, $priceCalculations) {
        $scope.pageTitle = "Nieuwe berekening aanmaken";

        $scope.calculation = {
            parameters: [],
            operations: []
        };

        $scope.save = function () {
            $priceCalculations.createCalculation($scope.calculation).then(function (calculation) {
                $scope.calculation = calculation;
            });
        }
    }
]);

pricesApp.controller('EditCalculationController', [
    '$scope',
    '$priceCalculations',
    '$routeParams',
    function ($scope, $priceCalculations, $routeParams) {
        $scope.calculation = { name: '' };
        $scope.pageTitle = 'Berekening: ';
        $scope.$watch('calculation.name', function (value) {
            $scope.pageTitle = 'Berekening: ' + value;
        });

        $priceCalculations.getCalculation($routeParams.calculationId).then(function (calculation) {
            $scope.calculation = calculation;
        });

        $scope.save = function () {

        }
    }
]);

    pricesApp.controller('EditCalculationDetailsController', [
    '$scope',
    '$priceCalculations',
    function ($scope, $priceCalculations) {
        $scope.$parent.$watch('calculation', function (calculation) {
            $scope.calculation = calculation;
        });

        // parameter
        $scope.parameterMode = 'create';
        $scope.parameter = {};

        $scope.saveParameter = function () {
            var par = angular.copy($scope.parameter);
            $scope.calculation.parameters.push(par);
            $scope.parameter = {};
            $scope.parameterMode = 'create';
        };

        $scope.editParameter = function (param, idx) {
            var par = angular.copy(param);
            $scope.calculation.parameters.splice(idx, 1);
            $scope.parameterMode = 'edit';
            $scope.parameter = par;
            $scope.editedParameter = param;
        }

        $scope.removeParameter = function (idx) {
            $scope.calculation.parameters.splice(idx, 1);
        }

        $scope.cancelEditParameter = function () {
            if ($scope.editedParameter) {
                $scope.parameter = {};
                $scope.calculation.parameters.push($scope.editedParameter);
                $scope.editedParameter = undefined;
                $scope.parameterMode = 'create';
            }
        }

        // operation
        $scope.operationMode = 'create';
        $scope.operation = {};

        $scope.saveOperation = function () {
            var op = angular.copy($scope.operation);
            $scope.calculation.operations.push(op);
            $scope.operation = {};
            $scope.operationMode = 'create';
        }

        $scope.editOperation = function (oper, idx) {
            var op = angular.copy(oper);
            $scope.calculation.operations.splice(idx, 1);
            $scope.operationMode = 'edit';
            $scope.operation = op;
            $scope.editedOperation = oper;
        }

        $scope.removeOperation = function (idx) {
            $scope.calculation.operations.splice(idx, 1);
        }

        $scope.cancelEditOperation = function () {
            if ($scope.editedOperation) {
                $scope.operation = {};
                $scope.calculation.operations.push($scope.editedOperation);
                $scope.editedOperation = undefined;
                $scope.operationMode = 'create';
            }
        }

        // reference data
        $priceCalculations.findOperations().then(function (operations) {
            $scope.operations = operations;
        });
    }
]);