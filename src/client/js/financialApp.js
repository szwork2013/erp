var financialApp = angular.module('FinancialApp', ['ngRoute']);

financialApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/overview', {
            controller: 'OverviewController'
        })
        .when('/transactions', {
            controller: 'TransactionsController',
            templateUrl: 'financial/transactions/index.partial.html'
        })
        .when('/settings', {
            redirectTo: '/settings/accounts'
        })
        .when('/settings/accounts', {
            controller: 'AccountsController',
            templateUrl: 'financial/settings/accounts.partial.html'
        })
        .when('/settings/accounts/create', {
            controller: 'CreateAccountController',
            templateUrl: 'financial/settings/account.create.partial.html'
        })
        .otherwise({
            redirectTo: '/overview'
        });
} ]);

financialApp.controller('OverviewController', [
    '$scope',
    function ($scope) {
        $scope.menu = {};
        $scope.menu.overviewClass = 'active';
    }
]);

financialApp.controller('AccountsController', [
    '$scope',
    '$accountService',
    function ($scope, $accountService) {
        var accountsPromise = $accountService.find();
        accountsPromise.then(function (accounts) {
            $scope.accounts = accounts;
        });
    }
]);

financialApp.controller('CreateAccountController', [
    '$scope',
    '$accountService',
    '$location',
    function ($scope, $accountService, $location) {
        $scope.account = {};

        var promise = $accountService.findTypes();
        promise.then(function (types) {
            $scope.types = types;

            $scope.create = function () {
                var p = $accountService.createAccount($scope.account.name, $scope.account.type);
                p.then(function () {
                    $location.path('/settings/accounts');
                }, function (reason) {
                    alert('fout: ' + reason);
                });
            };
        });
    }
]);

financialApp.factory('$accountService', [
    '$http',
    '$q',
    function ($http, $q) {
        return {
            find: function () {
                var deferred = $q.defer();

                var request = $http.get('/api/financial/accounts');
                request.success(function (data) {
                    deferred.resolve(data);
                })
                .error(function () {
                    deferred.reject('error');
                });

                return deferred.promise;
            },
            findTypes: function () {
                var deferred = $q.defer();

                var request = $http.get('/api/financial/accounts/types');
                request.success(function (types) {
                    deferred.resolve(types);
                })
                .error(function (err) {
                    deferred.reject(err);
                })

                return deferred.promise;
            },
            createAccount: function (name, type) {
                var deferred = $q.defer();

                var request = $http.put('/api/financial/accounts', { name: name, type: type });
                request.success(function (data) {
                    deferred.resolve();
                })
                .error(function () {
                    deferred.reject('error');
                })

                return deferred.promise;
            }
        };
    }
])