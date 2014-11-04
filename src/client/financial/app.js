require(['require', 'angular', 'underscore', 'angular-route', 'angular-ui', 'financial/services', 'contacts/services', 'common/services'], function (r, angular, $_) {
    var financialApp = angular.module('FinancialApp', ['ngRoute', 'ui.bootstrap', 'FinancialServices', 'ContactsServices', 'CommonServices']);

    financialApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/ledger', {
            controller: 'LedgerOverviewController',
            templateUrl: 'financial/ledger/overview.partial.html'
        })
        .when('/ledgeraccount/:id', {
            controller: 'LedgerAccountOverviewController',
            templateUrl: 'financial/ledger/account.partial.html'
        })
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
        .otherwise({
            redirectTo: '/ledger'
        });
    } ]);

    financialApp.controller('LedgerOverviewController', [
        '$scope',
        '$ledgers',
        '$modal',
        function ($scope, $ledgers, $modal) {
            var ledgerAccounts = {};

            function refresh() {
                $ledgers.findLedgers().then(function (data) {
                    $scope.ledgers = data;
                });

                $ledgers.findLedgerAccounts().then(function (data) {
                    ledgerAccounts = $_.groupBy(data, function (i) { return i.ledger._id; });
                });
            }

            refresh();

            $scope.findLedgerAccounts = function (ledger) {
                return ledgerAccounts[ledger];
            };

            $scope.createLedger = function () {
                var modal = $modal.open({
                    templateUrl: 'financial/ledger/ledger.modal.html',
                    controller: 'CreateLedgerModalController'
                });

                modal.result.then(function () { refresh(); });
            }

            $scope.createAccount = function (ledgerId) {
                var modal = $modal.open({
                    templateUrl: 'financial/ledger/account.modal.html',
                    controller: 'CreateAccountModalController',
                    resolve: {
                        ledgerId: function () {
                            return ledgerId;
                        }
                    }
                });

                modal.result.then(function () { refresh(); });
            }
        }
    ]);

    financialApp.controller('LedgerAccountOverviewController', [
        '$scope',
        '$ledgers',
        '$routeParams',
        function ($scope, $ledgers, $routerParams) {
            $ledgers.getLedgerAccount($routerParams.id).then(function (data) {
                $scope.account = data;
            });
        }
    ]);

    financialApp.controller('CreateLedgerModalController', [
        '$scope',
        '$modalInstance',
        '$ledgers',
        function ($scope, $modalInstance, $ledgers) {
            $scope.ledger = {};

            $scope.ok = function () {
                if ($scope.ledger.name) {
                    $ledgers.createLedger($scope.ledger.name).then(function () {
                        $modalInstance.close();
                    });
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
        }
    ]);

    financialApp.controller('CreateAccountModalController', [
        '$scope',
        '$modalInstance',
        '$ledgers',
        'ledgerId',
        function ($scope, $modalInstance, $ledgers, ledgerId) {
            $scope.account = { ledger: ledgerId, name: '' };

            $scope.ok = function () {
                if ($scope.account.name) {
                    $ledgers.createLedgerAccount($scope.account).then(function () {
                        $modalInstance.close();
                    });
                }
            }

            $scope.cancel = function () {
                $modalInstance.dismiss();
            }
        }
    ]);

    financialApp.controller('BankController', [
        '$scope',
        '$bankTransactions',
        '$modal',
        function ($scope, $bankTransactions, $modal) {
            $bankTransactions.findBankTransactions(50).then(function (transactions) {
                $scope.transactions = transactions;
            });

            $scope.showBookings = function (transaction) {
                var modal = $modal.open({
                    templateUrl: 'financial/bank/bookings.modal.html',
                    controller: 'TransactionBookingsModalController',
                    size: 'lg',
                    resolve: {
                        transaction: function () {
                            return angular.copy(transaction);
                        }
                    }
                });

                modal.result.then(
                    function () { },
                    function () { }
                );
            }
        }
    ]);

    financialApp.controller('TransactionBookingsModalController', [
        '$scope',
        '$modalInstance',
        '$ledgers',
        'transaction',
        function ($scope, $modalInstance, $ledgers, transaction) {
            $scope.transaction = transaction;
            $scope.bookings = [];

            $ledgers.findLedgerAccounts().then(function (data) {
                $scope.ledgerAccounts = data;
            });

            $ledgers.findBankTransactionBookings(transaction._id).then(function (data) {
                $scope.bookings = data;
            });

            $scope.booking = { bankTransaction: transaction._id };

            $scope.addBooking = function () {
                if ($scope.booking.ledgerAccount && $scope.booking.amount) {
                    var b = angular.copy($scope.booking);
                    $scope.bookings.push(b);
                    $scope.booking = { bankTransaction: transaction._id };
                }
            }

            $scope.ok = function () {
                $ledgers.saveBankTransactionBookings($scope.bookings).then(function () {
                    $modalInstance.close();
                }, function (err) {
                    alert(err);
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
        }
    ]);

    financialApp.controller('TransactionsController', [
        '$scope',
        '$http',
        '$common',
        function ($scope, $http, $common) {
            $scope.transaction = {};

            $scope.dates = $common.findDates(367, 0);

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

                $expenses.findExpenses(100, query).then(function (expenses) {
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

            // something with type[date]
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
        '$ledgers',
        '$expenses',
        function ($scope, $modalInstance, $contacts, $ledgers, $expenses) {
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