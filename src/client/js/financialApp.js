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
    function ($scope, $http) {
        $scope.transaction = {};

        var bankAccountsRequest = $http.get('/api/accounting/bankaccounts');
        bankAccountsRequest.success(function (data) {
            $scope.bankAccounts = data;
        })
    }
]);

financialApp.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function (e) {
            elem[0].focus();
        });
    };
});