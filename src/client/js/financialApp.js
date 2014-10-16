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
            var bankTransactionsRequest = $http.get('/api/accounting/bank/transactions/250');
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
    '$http',
    '$modal',
    function ($scope, $expenses, $http, $modal) {
        $scope.show = function (ex) {
            var modalInstance = $modal.open({
                templateUrl: 'financial/expenses/detail.modal.html',
                controller: 'ExpenseDetailsModalController',
                size: 'lg',
                resolve: {
                    expense: function () {
                        return ex;
                    }
                }
            });

            modalInstance.result.then(
                function () { },
                function () { }
            );
        }

        $expenses.findExpenses(100, {}).then(function (expenses) {
            $scope.expenses = expenses;
        });

        var suppliersRequest = $http.get('/api/contacts/leverancier');
        suppliersRequest.success(function (data) {
            $scope.suppliers = data;
        });

        $scope.filter = {};

        $scope.query = function () {
            var query = {};
            if ($scope.filter.supplier) {
                query.supplier = $scope.filter.supplier._id;
            }

            $expenses.findExpenses(100, query).then(function (expenses) {
                $scope.expenses = expenses;
            });
        }
    }
]);

financialApp.controller('ExpenseDetailsModalController', [
    '$scope',
    '$modalInstance',
    'expense',
    function ($scope, $modalInstance, expense) {
        $scope.expense = expense;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
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
    function ($http, $cacheFactory, $q) {
        return {
            _getContactsCache: function () {
                var cache = $cacheFactory.get('contacts');
                if (!cache) {
                    cache = $cacheFactory('contacts');
                }
                return cache;
            },
            findExpenses: function (pageSize, query) {
                var querystring = '?';
                for (var field in query) {
                    if (query.hasOwnProperty(field)) {
                        querystring += field + '=' + query[field];
                    }
                }

                var d = $q.defer();
                $http
                    .get('/api/accounting/expenses/' + pageSize + querystring)
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            }
        };
    }
]);