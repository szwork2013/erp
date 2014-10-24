require(['require', 'angular', 'angular-route', 'angular-ui', 'financial/services', 'contacts/services', 'common/services'], function (r, angular) {
    var financialApp = angular.module('FinancialApp', ['ngRoute', 'ui.bootstrap', 'FinancialServices', 'ContactsServices', 'CommonServices']);

    financialApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/ledger', {
            controller: 'LedgerOverviewController',
            templateUrl: 'financial/ledger/overview.partial.html'
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
        .when('/expenses/purchases', {
            controller: 'PurchasesController',
            templateUrl: 'financial/expenses/purchases.partial.html'
        })
        .otherwise({
            redirectTo: '/bank'
        });
    } ]);

    financialApp.controller('LedgerOverviewController', [
        '$scope',
        '$ledgers',
        '$modalInstance',
        function ($scope, $ledgers, $modalInstance) {
            var ledgerAccounts = [];

            $ledgers.findLedgers().then(function (data) {
                $scope.ledgers = data;
            });

            $ledgers.findLedgerAccounts().then(function (data) {
                $scope.ledgerAccounts = data;
            });
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

            $scope.edited = {};

            $scope.addBooking = function () {
                if ($scope.edited.ledgerAccount && $scope.edited.amount) {
                    var booking = angular.copy($scope.edited);
                    $scope.bookings.push(booking);
                    $scope.edited = {};
                }
            }

            $scope.ok = function () {
                $ledgers.saveBankTransactionBookings(transaction._id, $scope.bookings).then(function () {
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

                modalInstance.result.then(
                    function () {
                        $scope.reloadExpenses();
                    },
                    function () { }
                );
            }

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
        '$common',
        'expense',
        function ($scope, $modalInstance, $contacts, $common, expense) {
            $contacts.findSuppliers().then(function (data) {
                $scope.suppliers = data;
            });

            $scope.dates = $common.findDates(367, 0);

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

    r(['domReady!'], function (document) {
        angular.bootstrap(document, ['FinancialApp']);
    });
});