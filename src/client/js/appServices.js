var appServices = angular.module('appServices', []);

appServices.factory('$prices', [
    '$http',
    '$cacheFactory',
    '$q',
    function ($http, $cacheFactory, $q) {
        return {
            findPrices: function () {
                var d = $q.defer();

                $http
                    .get('/api/prices')
                    .success(function (prices) {
                        d.resolve(prices);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            }
        };
    }
]);