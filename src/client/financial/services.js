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
                },
                createExpense: function (expense) {
                    var d = $q.defer();

                    $http
                        .put('/api/accounting/expenses', expense)
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
                    return this._findLedgerAccounts('');
                },
                findContactLedgerAccounts: function (contactId) {
                    return this._findLedgerAccounts('contact=' + contactId);
                },
                _findLedgerAccounts: function (queryString) {
                    var d = $q.defer();

                    $http
                        .get('/api/accounting/ledgeraccounts?' + queryString)
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
                getLedgerAccount: function (id) {
                    var d = $q.defer();

                    $http
                        .get('/api/accounting/ledgeraccounts/' + id)
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
                saveBankTransactionBookings: function (bookings) {
                    var d = $q.defer();

                    $http
                        .post('/api/accounting/ledgeraccountbookings', bookings)
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