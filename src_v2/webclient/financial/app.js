require(['require', 'angular', 'underscore', 'angular-route', 'angular-ui', 'financial/services', 'contacts/services', 'angular-file-upload'], function (r, angular, $_) {
    var financialApp = angular.module('FinancialApp', ['ngRoute', 'ui.bootstrap', 'angularFileUpload', 'FinancialServices', 'ContactsServices']);

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
        .when('/bank', {
            controller: 'BankController',
            templateUrl: 'financial/bank/overview.partial.html'
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

            function refreschBookings() {
                $ledgerAccounts.findLedgerAccountBookings($routeParams.id).then(function (data) {
                    $scope.bookings = data;
                    $scope.balance = $_.reduce(data, function (memo, item) { return memo + item.amount; }, 0);
                });
            }

            refreschBookings();

            $scope.balanceSelected = 0;
            $scope.selected = [];

            $scope.select = function (booking) {
                if (booking.selected) {
                    $scope.selected.push(booking);
                    $scope.selected = $_.uniq($scope.selected);
                }
                else {
                    var i = $_.indexOf($scope.selected, booking);
                    if (i > -1) {
                        $scope.selected.splice(i, 1);
                    }
                }

                $scope.balanceSelected = $_.reduce($scope.selected, function (memo, b) { return memo + b.amount; }, 0);
            }

            $scope.closeBookings = function () {
                $ledgerAccounts.closeBookings($scope.selected).then(function () {
                    $scope.balanceSelected = 0;
                    $scope.selected = [];
                    refreschBookings();
                });
            }
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

    financialApp.controller('BankController', [
        '$scope',
        '$upload',
        '$bankTransactions',
        '$ledgerAccounts',
        function ($scope, $upload, $bankTransactions, $ledgerAccounts) {
            $scope.file = null;
            $scope.$watch('file', function () {
                if ($scope.file) {
                    $scope.upload = $upload.upload({
                        url: '/api/accounting/bank/transactions',
                        method: 'POST',
                        file: $scope.file
                    }).success(function () {
                        $scope.file = null;
                    });
                }
            });

            $ledgerAccounts.findLedgerAccounts().then(function (data) {
                $scope.ledgerAccounts = data;
            });

            $scope.book = function (transaction, ledgerAccount) {
                $bankTransactions.book(transaction, ledgerAccount).then(function (data) {
                    refreshTransactions();
                });
            }

            $scope.filter = {};

            function refreshTransactions() {
                $bankTransactions.findBankTransactions($scope.filter).then(function (data) {
                    $scope.bankTransactions = data;
                });
            }

            $scope.refreshTransactions = refreshTransactions;

            refreshTransactions();
        }
    ]);

    r(['domReady!'], function (document) {
        angular.bootstrap(document, ['FinancialApp']);
    });
});