require(['require', 'angular', 'angular-route', 'angular-ui', 'contacts/services', 'financial/services'], function (r, angular) {
    var contactsApp = angular.module('ContactsApp', ['ngRoute', 'ui.bootstrap', 'ContactsServices', 'FinancialServices']);

    contactsApp.config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/overview', {
                    controller: 'OverviewController',
                    templateUrl: 'contacts/index.partial.html'
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
        '$modal',
        '$contacts',
        function ($scope, $modal, $contacts) {
            $scope.create = function () {
                var modal = $modal.open({
                    templateUrl: 'contacts/contact.modal.html',
                    controller: 'CreateModalController'
                });

                modal.result.then(function () { refresh(); });
            }

            $scope.edit = function (contact) {
                var modal = $modal.open({
                    templateUrl: 'contacts/contact.modal.html',
                    controller: 'EditModalController',
                    resolve: {
                        contact: function () {
                            return contact;
                        }
                    }
                });

                modal.result.then(function () { refresh(); });
            }

            function refresh() {
                $contacts.findContacts().then(function (contacts) {
                    $scope.contacts = contacts;
                });
            }

            refresh();
        }
    ]);

    contactsApp.controller('CreateModalController', [
        '$scope',
        '$modalInstance',
        '$contacts',
        '$ledgers',
        function ($scope, $modalInstance, $contacts, $ledgers) {
            $scope.selectLedger = true;

            $scope.contact = {
                name: '',
                type: {
                    employee: false,
                    customer: false,
                    supplier: false
                },
                ledger: null
            };

            $ledgers.findLedgers().then(function (data) {
                $scope.ledgers = data;
            });

            $scope.ok = function () {
                $contacts.createContact($scope.contact.name, $scope.contact.type, $scope.contact.ledger).then(function (data) {
                    $modalInstance.close();
                });
            }

            $scope.cancel = function () {
                $modalInstance.dismiss();
            }
        }
    ]);

    contactsApp.controller('EditModalController', [
        '$scope',
        '$modalInstance',
        '$contacts',
        '$ledgers',
        'contact',
        function ($scope, $modalInstance, $contacts, $ledgers, contact) {
            $scope.selectLedger = false;

            $scope.contact = contact;

            $scope.cancel = function () {
                $modalInstance.dismiss();
            }
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