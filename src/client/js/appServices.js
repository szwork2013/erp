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
            },
            createPrice: function (name, unit, price) {
                var d = $q.defer();

                $http
                    .put('/api/prices', { name: name, unit: unit, price: price })
                    .success(function (price) {
                        d.resolve(price);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            updatePrice: function (id, name, unit, price) {
                var d = $q.defer();

                $http
                    .post('/api/prices/' + id, { name: name, unit: unit, price: price })
                    .success(function (price) {
                        d.resolve(price);
                    })
                    .error(function (err) {
                        d.reject(err);
                    })

                return d.promise;
            }
        };
    }
]);