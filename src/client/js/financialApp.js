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
        for (var i = -367; i <= 366; i++) {
            var d = new Date().setDate(now.getDate() + i);
            dates.push({ date: d, text: $filter('date')(d, 'dd/MM/yyyy') });
        }
        $scope.dates = dates;

        var bankAccountsRequest = $http.get('/api/accounting/bank/accounts');
        bankAccountsRequest.success(function (data) {
            $scope.bankAccounts = data;
        });

        function refreshTransactions() {
            var bankTransactionsRequest = $http.get('/api/accounting/bank/transactions/25');
            bankTransactionsRequest.success(function (data) {
                $scope.transactions = data;
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

financialApp.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function (e) {
            elem[0].focus();
        });
    };
});