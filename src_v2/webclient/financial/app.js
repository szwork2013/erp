require(['require', 'angular', 'underscore', 'angular-route', 'angular-ui', 'financial/services', 'contacts/services'], function (r, angular, $_) {
    var financialApp = angular.module('FinancialApp', ['ngRoute', 'ui.bootstrap', 'FinancialServices', 'ContactsServices']);

    financialApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/ledgeraccounts', {
            controller: 'LedgerAccountsOverviewController',
            templateUrl: 'financial/ledgeraccounts/overview.partial.html'
        })
        .when('/ledgeraccounts/:id', {
            controller: 'LedgerAccountController',
            templateUrl: 'financial/ledgeraccounts/account.partial.html'
        })
        .when('/expenses', {
            controller: 'ExpensesController',
            templateUrl: 'financial/expenses/overview.partial.html'
        })
        .otherwise({
            redirectTo: '/ledgeraccounts'
        });
    } ]);

    financialApp.controller('LedgerAccountsOverviewController', [
        '$scope',
        '$ledgerAccounts',
        function ($scope, $ledgerAccounts) {
            $ledgerAccounts.findLedgerAccounts().then(function (data) {
                $scope.ledgerAccounts = data;
            });
        }
    ]);

    financialApp.controller('LedgerAccountController', [
        '$scope',
        '$ledgerAccounts',
        '$routeParams',
        function ($scope, $ledgerAccounts, $routeParams) {
            $ledgerAccounts.getLedgerAccount($routeParams.id).then(function (data) {
                $scope.ledgerAccount = data;
            });

            $ledgerAccounts.findLedgerAccountBookings($routeParams.id).then(function (data) {
                $scope.bookings = data;
            });
        }
    ]);

    financialApp.controller('ExpensesController', [
        '$scope',
        '$expenses',
        '$contacts',
        '$http',
        '$modal',
        function ($scope, $expenses, $contacts, $http, $modal) {
            $scope.create = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'financial/expenses/detail.modal.html',
                    controller: 'ExpenseCreateModalController',
                    size: 'lg'
                });

                modalInstance.result.then(function () {
                    $scope.reloadExpenses();
                });
            };

            $scope.show = function (ex) {
                var modalInstance = $modal.open({
                    templateUrl: 'financial/expenses/detail.modal.html',
                    controller: 'ExpenseDetailsModalController',
                    size: 'lg',
                    resolve: {
                        expense: function () {
                            return angular.copy(ex);
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $scope.reloadExpenses();
                });
            };

            $scope.filter = {};

            $scope.reloadExpenses = function () {
                var query = {};
                if ($scope.filter.supplier) {
                    query.supplier = $scope.filter.supplier._id;
                }

                $expenses.findExpenses(query).then(function (expenses) {
                    $scope.expenses = expenses;
                });
            }

            $scope.reloadExpenses();

            $contacts.findSuppliers().then(function (data) {
                $scope.suppliers = data;
            });
        }
    ]);

    financialApp.controller('ExpenseDetailsModalController', [
        '$scope',
        '$modalInstance',
        '$contacts',
        'expense',
        '$filter',
        function ($scope, $modalInstance, $contacts, expense, $filter) {
            $contacts.findSuppliers().then(function (data) {
                $scope.suppliers = data;
            });

            // something with type[date] and data binding in angular
            if (expense && expense.date) {
                expense.date = $filter('date')(expense.date, 'yyyy-MM-dd');
            }

            if (expense && expense.expirationDate) {
                expense.expirationDate = $filter('date')(expense.expirationDate, 'yyyy-MM-dd');
            }

            $scope.expense = expense;

            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
        }
    ]);

    financialApp.controller('ExpenseCreateModalController', [
        '$scope',
        '$modalInstance',
        '$contacts',
        '$expenses',
        function ($scope, $modalInstance, $contacts, $expenses) {
            $scope.expense = {};

            $contacts.findSuppliers().then(function (data) {
                $scope.suppliers = data;
            });

            $scope.ok = function () {
                $expenses.createExpense($scope.expense).then(function () {
                    $modalInstance.close();
                });
            }

            $scope.cancel = function () {
                $modalInstance.dismiss();
            }
        }
    ]);

    r(['domReady!'], function (document) {
        angular.bootstrap(document, ['FinancialApp']);
    });
});