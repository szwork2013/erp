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
                            return angular.copy(contact);
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

            $scope.contact = {
                name: '',
                type: {
                    employee: false,
                    customer: false,
                    supplier: false
                }
            };

            $ledgers.findLedgers().then(function(data) {
                $scope.ledgers = data;
            });

            $scope.ok = function () {
                $contacts.createContact($scope.contact).then(function (data) {
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
            $scope.contact = contact;

            $ledgers.findLedgers().then(function(data) {
                $scope.ledgers = data;
            });

            $scope.ok = function () {
                $contacts.updateContact($scope.contact).then(function (data) {
                    $modalInstance.close();
                });
            }

            $scope.cancel = function () {
                $modalInstance.dismiss();
            }
        }
    ]);

    r(['domReady!'], function (document) {
        angular.bootstrap(document, ['ContactsApp']);
    });
});