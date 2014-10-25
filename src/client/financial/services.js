require(['angular', 'angular-ui'], function (angular) {
    var services = angular.module('FinancialServices', ['ui.bootstrap']);

    services.factory('$expenses', [
        '$http',
        '$q',
        function ($http, $q) {
            return {
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

    services.factory('$bankTransactions', [
        '$http',
        '$q',
        function ($http, $q) {
            return {
                findBankTransactions: function (pageSize) {
                    if (!pageSize) {
                        pageSize = 50;
                    }

                    var d = $q.defer();

                    $http
                        .get('/api/accounting/bank/transactions/' + pageSize)
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

    services.factory('$ledgers', [
        '$http',
        '$q',
        function ($http, $q) {
            return {
                findLedgers: function () {
                    var d = $q.defer();

                    $http
                        .get('/api/accounting/ledgers')
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                createLedger: function (name) {
                    var d = $q.defer();

                    $http
                        .put('/api/accounting/ledgers', { name: name })
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                findLedgerAccounts: function () {
                    var d = $q.defer();

                    $http
                        .get('/api/accounting/ledgeraccounts')
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                createLedgerAccount: function (account) {
                    var d = $q.defer();

                    $http
                        .put('/api/accounting/ledgeraccounts', account)
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                findBankTransactionBookings: function (bankTransactionId) {
                    var d = $q.defer();

                    $http
                        .get('/api/accounting/ledgeraccountbookings/?bankTransactionId=' + bankTransactionId)
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                saveBankTransactionBookings: function (bankTransactionId, bookings) {
                    var d = $q.defer();

                    $http
                        .post('/api/accounting/ledgeraccountbookings?bankTransactionId=' + bankTransactionId, bookings)
                        .success(function () {
                            d.resolve();
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                }
            };
        }
    ]);
});