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
});