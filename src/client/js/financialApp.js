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
    '$http',
    function ($scope, $http) {

    }
]);

    financialApp.controller('PurchasesController', [
    '$scope',
    '$http',
    '$filter',
    function ($scope, $http, $filter) {
        var now = new Date();
        var dates = [];
        for (var i = -367; i <= 100; i++) {
            var d = new Date().setDate(now.getDate() + i);
            dates.push({ date: d, text: $filter('date')(d, 'dd/MM/yyyy') });
        }
        $scope.dates = dates;

        $scope.suppliers = [];
        var suppliersRequest = $http.get('/api/contacts/leverancier');
        suppliersRequest.success(function (data) {
            $scope.suppliers = data;
        });

        $scope.purchase = {
            netAmount: 0,
            vatAmount: 0,
            totalAmount: 0,
            partialAmounts: [createNewPartialAmount()],
            update: function () {
                this.netAmount = 0;
                this.vatAmount = 0;
                this.totalAmount = 0;

                var me = this;

                angular.forEach(this.partialAmounts, function (pa) {
                    pa.update();
                    me.netAmount += Number.parseFloat(pa.netAmount);
                    me.vatAmount += pa.vatAmount;
                    me.totalAmount += pa.totalAmount;
                })

                this.netAmount = Math.round(this.netAmount * 10000) / 10000;
                this.vatAmount = Math.round(this.vatAmount * 10000) / 10000;
                this.totalAmount = Math.round(this.totalAmount * 10000) / 10000;
            },
            addPartialAmount: function () {
                this.partialAmounts.push(createNewPartialAmount());
            },
            removePartialAmount: function (index) {
                this.partialAmounts.splice(index, 1);
            }
        };

        $scope.addPartialAmount = function () {
            $scope.purchase.addPartialAmount();
        }

        $scope.removePartialAmount = function (index) {
            $scope.purchase.removePartialAmount(index);
        }

        function createNewPartialAmount() {
            return {
                netAmount: 0,
                vatPercentage: 0.21,
                vatAmount: 0,
                totalAmount: 0,
                update: function () {
                    this.vatAmount = Math.round(this.netAmount * Number.parseFloat(this.vatPercentage) * 10000) / 10000;
                    this.totalAmount = Math.round((Number.parseFloat(this.netAmount) + this.vatAmount) * 10000) / 10000;
                }
            };
        }

        $scope.$watch('purchase.partialAmounts', function () {
            $scope.purchase.update();
        }, true);
    }
]);

financialApp.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function (e) {
            elem[0].focus();
        });
    };
});