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
            .when('/operations', {
                controller: 'OperationsOverviewController',
                templateUrl: 'prices/operations/overview.partial.html'
            })
            .when('/resources', {
                controller: 'ResourcesOverviewController',
                templateUrl: 'prices/resources/overview.partial.html'
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
    '$location',
    function ($scope, $priceCalculations, $location) {
        $scope.pageTitle = "Nieuwe berekening aanmaken";

        $scope.calculation = {
            parameters: [],
            operations: []
        };

        $scope.save = function () {
            $priceCalculations.createCalculation($scope.calculation).then(function (calculation) {
                $location.path('/calculations/' + calculation._id);
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
            $priceCalculations.updateCalculation($scope.calculation).then(function (calculation) {
                $scope.calculation = calculation;
            });
        }
    }
]);

    pricesApp.controller('CalculationDetailsController', [
    '$scope',
    '$priceCalculations',
    function ($scope, $priceCalculations) {
        $scope.parameterCollection = {};

        $scope.$parent.$watch('calculation', function (value) {
            //$scope.calculation = value;
            $scope.parameterCollection.collection = value.parameters;
            $scope.variableCollection.collection = value.variables;
            $scope.operationColleciton.collection = value.opeartions;
        });

        function CollectionManager() {
            return {
                collection: [],
                mode: 'create',
                oldItem: null,
                currentItem: {},
                editItem: function (item, index) {
                    this.mode = 'edit';
                    this.oldItem = item;
                    this.collection.splice(index, 1);
                    this.currentItem = angular.copy(item);
                },
                cancelEditItem: function () {
                    if (this.oldItem) {
                        this.currentItem = {};
                        this.collection.push(this.oldItem);
                        this.oldItem = undefined;
                        this.mode = 'create';
                    }
                },
                deleteItem: function (item, index) {
                    this.collection.splice(index, 1);
                },
                saveItem: function () {
                    var i = angular.copy(this.currentItem);
                    this.collection.push(i);
                    this.currentItem = {};
                    this.oldItem = undefined;
                    this.mode = 'create';
                }
            }
        }

        $scope.parameterCollection = CollectionManager();
        $scope.variableCollection = CollectionManager();
        $scope.opeartionCollection = CollectionManager();

        // reference data
        $priceCalculations.findOperations().then(function (operations) {
            $scope.operations = operations;
        });
    }
]);

pricesApp.controller('OperationsOverviewController', [
    '$scope',
    '$priceCalculations',
    function ($scope, $priceCalculations) {
        $scope.operation = { resources: [] };
        $scope.editMode = false;

        $scope.createOperation = function () {
            if (!$scope.editMode) {
                $scope.editMode = 'create';
                $scope.operation = { resources: [] };
            }
        }

        $scope.editOperation = function (operation) {
            if (!$scope.editMode) {
                $scope.editMode = 'edit';
                $scope.operation = angular.copy(operation);
            }
        }

        $scope.save = function () {
            if ($scope.editMode == 'create') {
                $priceCalculations.createOperation($scope.operation).then(function () {
                    $scope.operation = {};
                    $scope.editMode = false;
                    reloadOperations();
                });
            }

            if ($scope.editMode == 'edit') {
                $priceCalculations.updateOperation($scope.operation).then(function () {
                    $scope.operation = {};
                    $scope.editMode = false;
                    reloadOperations();
                })
            }
        }

        $scope.cancelEdit = function () {
            $scope.editMode = false;
            $scope.operation = { resources: [] };
        }

        // operation resources
        $priceCalculations.findResources().then(function (resources) {
            $scope.resources = resources;
        });

        $scope.resourceCollection = {
            collection: $scope.operation.resources,
            mode: 'create',
            oldItem: null,
            currentItem: {},
            editItem: function (item, index) {
                this.mode = 'edit';
                this.oldItem = item;
                this.collection.splice(index, 1);
                this.currentItem = angular.copy(item);
            },
            deleteItem: function (item, index) {
                this.collection.splice(index, 1);
            },
            saveItem: function () {
                var i = angular.copy(this.currentItem);
                this.collection.push(i);
                this.currentItem = {};
                this.mode = 'create';
            }
        };

        $scope.resourceMode = 'create';
        $scope.resource = {};

        $scope.editResource = function (res, index) {
            $scope.resourceMode = 'edit';
            $scope.editedResource = res;
            $scope.operation.resources.splice(index, 1);
            $scope.resource = angular.copy(res);
        }

        $scope.deleteResource = function (index) {

        }

        $scope.saveResource = function () {
            var res = angular.copy($scope.resource);
            $scope.operation.resources.push(res);
            $scope.resource = {};
            $scope.resourceMode = 'create';
        }

        function reloadOperations() {
            $priceCalculations.findOperations().then(function (operations) {
                $scope.operations = operations;
            });
        }

        reloadOperations();
    }
]);

pricesApp.controller('ResourcesOverviewController', [
    '$scope',
    '$priceCalculations',
    function ($scope, $priceCalculations) {
        $scope.resource = {};
        $scope.editMode = false;

        $scope.createResource = function () {
            if (!$scope.editMode) {
                $scope.editMode = 'create';
                $scope.resource = {};
            }
        }

        $scope.editResource = function (resource) {
            if (!$scope.editMode) {
                $scope.editMode = 'edit';
                $scope.resource = angular.copy(resource);
            }
        }

        $scope.save = function () {
            if ($scope.editMode == 'create') {
                $priceCalculations.createResource($scope.resource).then(function () {
                    $scope.resource = {};
                    $scope.editMode = false;
                    reloadResources();
                });
            }

            if ($scope.editMode == 'edit') {
                $priceCalculations.updateResource($scope.resource).then(function () {
                    $scope.resource = {};
                    $scope.editMode = false;
                    reloadResources();
                })
            }
        }

        $scope.cancelEdit = function () {
            $scope.editMode = false;
        }

        function reloadResources() {
            $priceCalculations.findResources().then(function (resources) {
                $scope.resources = resources;
            });
        }

        reloadResources();
    }
]);