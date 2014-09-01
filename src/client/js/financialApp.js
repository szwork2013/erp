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
        .when('/transactions/add', {
            controller: 'AddTransactionsController',
            templateUrl: 'financial/transactions/add.partial.html'
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

financialApp.controller('AddTransactionsController', [
    '$scope',
    '$accountService',
    '$rootScope',
    '$timeout',
    function ($scope, $accountService, $rootScope, $timeout) {
        $scope.transactions = [];
        $scope.transaction = {};

        $accountService.findByType('Bankrekening').then(function (data) { $scope.accounts = data; });

        $scope.add = function () {
            var t = $scope.transaction;
            $scope.transactions.push(t);
            $scope.transaction = {
                account: t.account,
                date: t.date
            };

            $timeout(function () {
                $rootScope.$broadcast('TransactionAdded');
            });
        };

        $scope.save = function () {
            var ts = $scope.transactions;
            var promise = $accountService.saveTransactions(ts);
            promise.then(function () {
                $scope.transactions = [];
            }, function (err) {
                alert(err);
            });
        };
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
            findByType: function (type) {
                var deferred = $q.defer();

                var request = $http.get('/api/financial/accounts/' + type);
                request.success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (err) {
                    deferred.reject(err);
                })

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
            },
            saveTransactions: function (transactions) {
                var deferred = $q.defer();

                var request = $http.put('/api/financial/transactions', transactions);
                request.success(function () {
                    deferred.resolve();
                })
                .error(function (err) {
                    deferred.reject(err);
                })

                return deferred.promise;
            }
        };
    }
]);

financialApp.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function (e) {
            elem[0].focus();
        });
    };
});