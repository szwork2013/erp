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
                createContact: function (contact) {
                    var d = $q.defer();

                    $http
                        .put('/api/contacts', contact)
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        })

                    return d.promise;
                },
                updateContact: function (contact) {
                    var d = $q.defer();

                    $http
                        .post('/api/contacts/' + contact._id, contact)
                        .success(function (data) {
                            d.resolve(data);
                        })
                        .error(function (err) {
                            d.reject(err);
                        });

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