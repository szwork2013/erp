require(['angular'], function (angular) {
    var services = angular.module('ContactsServices', []);

    services.factory('$contacts', [
        '$http',
        '$q',
        function ($http, $q) {
            return {
                findContacts: function () {
                    var d = $q.defer();

                    $http
                        .get('/api/contacts')
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                },
                createContact: function (name, types, ledger) {
                    var d = $q.defer();

                    $http
                        .put('/api/contacts', { name: name, type: types })
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        })

                    return d.promise;
                },
                findSuppliers: function () {
                    var d = $q.defer();

                    $http
                        .get('/api/contacts/leverancier')
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

                    return d.promise;
                }
            }
        }
    ]);
});