require(['require', 'angular', 'angular-route', 'contacts/services'], function (r, angular) {
    var contactsApp = angular.module('ContactsApp', ['ngRoute', 'ContactsServices']);

    contactsApp.config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/overview', {
                    controller: 'OverviewController',
                    templateUrl: 'contacts/index.partial.html'
                })
                .when('/create', {
                    controller: 'CreateController',
                    templateUrl: 'contacts/create.partial.html'
                })
                .when('/:contactId', {
                    controller: 'DetailsController',
                    templateUrl: 'contacts/details.partial.html'
                })
                .otherwise({
                    redirectTo: '/overview'
                });
        }
    ]);

    contactsApp.controller('OverviewController', [
        '$scope',
        '$contacts',
        function ($scope, $contacts) {
            $contacts.findContacts().then(function (contacts) {
                $scope.contacts = contacts;
            });
        }
    ]);

    contactsApp.controller('CreateController', [
        '$scope',
        '$http',
        '$location',
        function ($scope, $http, $location) {
            $scope.name = undefined;
            $scope.type = {
                personeel: false,
                klant: false,
                leverancier: false
            };

            var contactTypesRequest = $http.get('/api/contacts/types');
            contactTypesRequest.success(function (data) {
                $scope.types = data;

                $scope.save = function () {
                    var contact = {
                        name: $scope.name,
                        types: $scope.type
                    };

                    var saveRequest = $http.put('/api/contacts', contact);
                    saveRequest.success(function (data) {
                        $location.path(data._id);
                    })
                }
            });
        }
    ]);

    contactsApp.controller('DetailsController', [
        '$scope',
        '$http',
        '$routeParams',
        function ($scope, $http, $routeParams) {
            var contactRequest = $http.get('/api/contacts/contact/' + $routeParams.contactId);
            contactRequest.success(function (data) {
                $scope.contact = data;
            });
        }
    ]);

    r(['domReady!'], function (document) {
        angular.bootstrap(document, ['ContactsApp']);
    });
});