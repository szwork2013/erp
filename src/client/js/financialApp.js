var financialApp = angular.module('FinancialApp', ['ngRoute', 'ui.bootstrap']);

financialApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/bank', {
            controller: 'BankController',
            templateUrl: 'financial/bank/overview.partial.html'
        })
        .when('/bank/transactions', {
            controller: 'TransactionsController',
            templateUrl: 'financial/bank/transactions.partial.html'
        })
        .when('/expenses', {
            controller: 'ExpensesController',
            templateUrl: 'financial/expenses/overview.partial.html'
        })
        .when('/expenses/purchases', {
            controller: 'PurchasesController',
            templateUrl: 'financial/expenses/purchases.partial.html'
        })
        .otherwise({
            redirectTo: '/bank'
        });
} ]);

financialApp.controller('TransactionsController', [
    '$scope',
    '$http',
    '$filter',
    function ($scope, $http, $filter) {
        $scope.transaction = {};

        $scope.dates = [];
        // load dates
        var now = new Date();
        var dates = [];
        for (var i = -367; i <= 0; i++) {
            var d = new Date().setDate(now.getDate() + i);
            dates.push({ date: d, text: $filter('date')(d, 'dd/MM/yyyy') });
        }
        $scope.dates = dates;

        var bankAccountsLookup = {};
        var bankAccountsRequest = $http.get('/api/accounting/bank/accounts');
        bankAccountsRequest.success(function (data) {
            $scope.bankAccounts = data;
            angular.forEach(data, function (value) {
                bankAccountsLookup[value._id] = value;
            });
        });

        function refreshTransactions() {
            var bankTransactionsRequest = $http.get('/api/accounting/bank/transactions/25');
            bankTransactionsRequest.success(function (data) {
                $scope.transactions = data;
                angular.forEach($scope.transactions, function (transaction) {
                    transaction.bankAccount = bankAccountsLookup[transaction.bankAccountId];
                });
            });
        }

        refreshTransactions();

        $scope.saveTransaction = function () {
            var trans = {
                bankAccountId: $scope.transaction.bankAccount._id,
                date: $scope.transaction.date.date,
                amount: $scope.transaction.amount,
                message: $scope.transaction.message
            };

            var saveTransactionRequest = $http.put('/api/accounting/bank/transactions', trans);
            saveTransactionRequest.success(function () {
                $scope.transaction.amount = 0;
                $scope.transaction.message = '';
                $scope.$broadcast('TransactionSaved');

                refreshTransactions();
            });
        }
    }
]);

    financialApp.controller('ExpensesController', [
    '$scope',
    '$expenses',
    function ($scope, $expenses) {
        $scope.searchOpened = false;
        $scope.toggleSearch = function () {
            $scope.searchOpened = !$scope.searchOpened;
        }

        $scope.filter = {};

        $scope.findExpenses = function () {
            $expenses.findExpenses(25, 0, $scope.filter).then(function (expenses) {
                $scope.expenses = expenses;
            });
        }

        $scope.findExpenses();
    }
]);

financialApp.controller('PurchasesController', [
    '$scope',
    '$http',
    '$filter',
    function ($scope, $http, $filter) {
        $scope.expenses = [];
        function refreshExpenses() {
            var expensesRequest = $http.get('/api/accounting/expenses/25');
            expensesRequest.success(function (data) {
                $scope.expenses = data;
                angular.forEach($scope.expenses, function (item) {
                    item.supplier = $scope.suppliersLookup[item.supplierId];
                });

                $scope.expenses = data;
            });
        }

        var now = new Date();
        var dates = [];
        for (var i = -367; i <= 100; i++) {
            var d = new Date().setDate(now.getDate() + i);
            dates.push({ date: d, text: $filter('date')(d, 'dd/MM/yyyy') });
        }
        $scope.dates = dates;

        $scope.suppliersLookup = {};
        $scope.suppliers = [];
        var suppliersRequest = $http.get('/api/contacts/leverancier');
        suppliersRequest.success(function (data) {
            angular.forEach(data, function (item) {
                $scope.suppliersLookup[item._id] = item;
            });
            $scope.suppliers = data;

            refreshExpenses();
        });

        resetPurchase();

        function resetPurchase() {
            $scope.purchase = {
                netAmount: 0,
                vatAmount: 0,
                totalAmount: 0,
                update: function () {
                    this.netAmount = Math.round(this.netAmount * 10000) / 10000;
                    this.vatAmount = Math.round(this.vatAmount * 10000) / 10000;
                    this.totalAmount = this.netAmount + this.vatAmount;
                }
            };
        }

        $scope.$watch('purchase', function () {
            $scope.purchase.update();
        }, true);

        $scope.save = function () {
            var ex = {};
            angular.copy($scope.purchase, ex);
            ex.supplierId = ex.supplier._id;
            delete ex.supplier;
            var d = ex.date;
            ex.date = d.date;
            d = ex.expirationDate;
            ex.expirationDate = d.date;

            var saveRequest = $http.put('/api/accounting/expenses', ex);
            saveRequest.success(function (data) {
                resetPurchase();
                refreshExpenses();
            });
        }
    }
]);

financialApp.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function (e) {
            elem[0].focus();
        });
    };
});

financialApp.factory('$expenses', [
    '$http',
    '$cacheFactory',
    '$q',
    '$filter',
    function ($http, $cacheFactory, $q, $filter) {
        return {
            _getContactsCache: function () {
                var cache = $cacheFactory.get('contacts');
                if (!cache) {
                    cache = $cacheFactory('contacts');
                }
                return cache;
            },
            findExpenses: function (pageSize, page, query) {
                var me = this;
                function getLeveranciers() {
                    var cache = me._getContactsCache();

                    var leveranciersLookup = cache.get('leveranciers_lookup');
                    var d = $q.defer();
                    if (!leveranciersLookup) {
                        leveranciersLookup = {};
                        $http.get('/api/contacts/leverancier').success(function (data) {
                            angular.forEach(data, function (item) {
                                leveranciersLookup[item._id] = item;
                            });

                            cache.put('leveranciers_lookup', leveranciersLookup);
                            d.resolve(leveranciersLookup);
                        }).error(function (err) {
                            d.reject(err);
                        });
                    }
                    else {
                        d.resolve(leveranciersLookup);
                    }

                    return d.promise;
                }

                function filterLeveranciers(leveranciersLookup) {
                    var d = $q.defer();

                    var filter = {};
                    if (query && query.name) {
                        filter = { 'name': query.name };
                    }

                    d.resolve($filter('filter')(leveranciersLookup, filter));

                    return d.promise;
                }

                function getExpenses(leveranciersLookup) {
                    var d = $q.defer();
                    $http
                        .get('/api/accounting/expenses/' + pageSize)
                        .success(function (data) {
                            var expenses = [];
                            angular.forEach(data, function (item) {
                                item.supplier = leveranciersLookup[item.supplierId];
                                if (item.supplier) {
                                    expenses.push(item);
                                }
                            });

                            d.resolve(expenses);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                }

                return getLeveranciers().then(filterLeveranciers).then(getExpenses);
            }
        };
    }
]);