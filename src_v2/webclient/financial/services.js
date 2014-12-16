require(['angular', 'angular-ui', 'underscore'], function (angular, angularui, underscore) {
    var services = angular.module('FinancialServices', ['ui.bootstrap']);

    services.factory('$expenses', [
        '$http',
        '$q',
        function ($http, $q) {
            return {
                findExpenses: function (query) {
                    var querystring = '?';
                    for (var field in query) {
                        if (query.hasOwnProperty(field)) {
                            querystring += field + '=' + query[field];
                        }
                    }

                    var d = $q.defer();
                    $http
                        .get('/api/accounting/expenses/' + querystring)
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
                },
                updateExpense: function (expense) {
                    var d = $q.defer();

                    $http
                        .post('/api/accounting/expenses/', expense)
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
                findBankTransactions: function (filter) {
                    var d = $q.defer();

                    $http
                        .get('/api/accounting/bank/transactions')
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                book: function (transaction, ledgerAccount) {
                    var d = $q.defer();

                    $http
                        .put('/api/accounting/bank/booking', { transaction: transaction._id, ledgerAccount: ledgerAccount._id })
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

    services.factory('$ledgerAccounts', [
        '$http',
        '$q',
        function ($http, $q) {
            return {
                _findLedgerAccountTypes: function () {
                    return {
                        'supplier': { name: 'Leverancier' },
                        'customer': { name: 'Klant' }
                    }
                },
                findLedgerAccounts: function () {
                    var d = $q.defer();
                    var me = this;

                    $http
                        .get('/api/accounting/ledgeraccounts')
                        .success(function (data) {
                            var types = me._findLedgerAccountTypes();
                            underscore.each(data, function (item) {
                                item.type = types[item.type].name;
                            });
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                getLedgerAccount: function (id) {
                    var d = $q.defer();
                    var me = this;

                    $http
                        .get('/api/accounting/ledgeraccounts/' + id)
                        .success(function (data) {
                            data.type = me._findLedgerAccountTypes()[data.type].name;
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        })

                    return d.promise;
                },
                findLedgerAccountBookings: function (ledgerAccountId) {
                    var d = $q.defer();

                    $http
                        .get('/api/accounting/ledgeraccountbookings/' + ledgerAccountId)
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                closeBookings: function (bookings) {
                    var d = $q.defer();

                    $http
                        .put('/api/accounting/ledgeraccountbookings/close', bookings)
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
});