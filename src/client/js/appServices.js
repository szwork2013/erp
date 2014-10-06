var appServices = angular.module('appServices', ['ngRoute']);

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

appServices.factory('$priceCalculations', [
    '$http',
    '$q',
    function ($http, $q) {
        return {
            findCalculations: function () {
                var d = $q.defer();

                $http
                    .get('/api/pricecalculations/calculations')
                    .success(function (calculations) {
                        d.resolve(calculations);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            getCalculation: function (id) {
                var d = $q.defer();

                $http
                    .get('/api/pricecalculations/calculations/' + id)
                    .success(function (calculation) {
                        d.resolve(calculation);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            createCalculation: function (calculation) {
                var d = $q.defer();

                angular.forEach(calculation.operations, function (operation) {
                    if (operation.operation && operation.operation._id) {
                        operation.operation = operation.operation._id;
                    }
                });

                $http
                    .put('/api/pricecalculations/calculations', calculation)
                    .success(function (calculation) {
                        d.resolve(calculation);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            updateCalculation: function (calculation) {
                var d = $q.defer();

                angular.forEach(calculation.operations, function (operation) {
                    if (operation.operation && operation.operation._id) {
                        operation.operation = operation.operation._id;
                    }
                });

                $http
                    .post('/api/pricecalculations/calculations/' + calculation._id, calculation)
                    .success(function (result) {
                        if (Array.isArray(result) && result.length > 0) {
                            d.resolve(result[0]);
                        }
                        else {
                            d.resolve(result);
                        }
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            findOperations: function () {
                var d = $q.defer();

                $http
                    .get('/api/pricecalculations/operations')
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            createOperation: function (operation) {
                var d = $q.defer();

                angular.forEach(operation.resources, function (res) {
                    if (res.resource && res.resource._id) {
                        res.resource = res.resource._id;
                    }
                });

                $http
                    .put('/api/pricecalculations/operations', operation)
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            updateOperation: function (operation) {
                var d = $q.defer();

                angular.forEach(operation.resources, function (res) {
                    if (res.resource && res.resource._id) {
                        res.resource = res.resource._id;
                    }
                });

                $http
                    .post('/api/pricecalculations/operations/' + operation._id, operation)
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            findResources: function () {
                var d = $q.defer();

                $http
                    .get('/api/pricecalculations/resources')
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (err) {
                        d.reject(err);
                    })

                return d.promise;
            },
            createResource: function (resource) {
                var d = $q.defer();

                $http
                    .put('/api/pricecalculations/resources', resource)
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (err) {
                        d.reject(err);
                    });

                return d.promise;
            },
            updateResource: function (resource) {
                var d = $q.defer();

                $http
                    .post('/api/pricecalculations/resources/' + resource._id, resource)
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