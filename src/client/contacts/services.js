require(['angular', 'angular-ui'], function (angular, angularUi) {
    var services = angular.module('ContactsServices', ['ui.bootstrap']);

    services.factory('$contacts', [
        '$http',
        '$q',
        function ($http, $q) {
            return {
                findContacts: function () {
                    var d = $q.defer();

                    var request =
                        $http
                            .get('/api/contacts')
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