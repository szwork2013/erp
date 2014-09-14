var contactsApp = angular.module('ContactsApp', ['ngRoute']);

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
            .otherwise({
                redirectTo: '/overview'
            });
    }
]);

contactsApp.controller('OverviewController', [
    '$scope',
    '$http',
    function ($scope, $http) {
        var contactsRequest = $http.get('/api/contacts');
        contactsRequest.success(function (data) {
            $scope.contacts = data;
        });
    }
]);

contactsApp.controller('CreateController', [
    '$scope',
    '$http',
    '$location',
    function ($scope, $http, $location) {
        $scope.name = undefined;

        var contactTypesRequest = $http.get('/api/contacts/types');
        contactTypesRequest.success(function (data) {
            $scope.types = data;

            $scope.save = function () {
                var typeIds = [];
                for (var idx = 0; idx < $scope.types.length; idx++) {
                    if ($scope.types[idx].selected) {
                        typeIds.push($scope.types[idx]._id);
                    }
                }

                var contact = {
                    name: $scope.name,
                    types: typeIds
                };

                var saveRequest = $http.put('/api/contacts', contact);
                saveRequest.success(function (data) {
                    $location.path('overview');
                })
            }
        });
    }
]);