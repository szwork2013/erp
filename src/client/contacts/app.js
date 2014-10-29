require(['require', 'angular', 'underscore', 'angular-route', 'angular-ui', 'contacts/services', 'financial/services'], function (r, angular, underscore) {
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

            $scope.showLedgerAccounts = function (contact) {
                var modal = $modal.open({
                    templateUrl: 'contacts/ledgeraccounts.modal.html',
                    controller: 'EditLedgerAccountsModalController',
                    resolve: {
                        contact: function () {
                            return angular.copy(contact);
                        }
                    }
                });
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
        function ($scope, $modalInstance, $contacts) {

            $scope.contact = {
                name: '',
                type: {
                    employee: false,
                    customer: false,
                    supplier: false
                }
            };

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
        'contact',
        function ($scope, $modalInstance, $contacts, contact) {
            $scope.contact = contact;

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

    contactsApp.controller('EditLedgerAccountsModalController', [
        '$scope',
        '$modalInstance',
        '$ledgers',
        'contact',
        function ($scope, $modalInstance, $ledgers, contact) {
            $scope.contact = contact;

            function refreshAccounts() {
                $ledgers.findContactLedgerAccounts(contact._id).then(function (data) {
                    $scope.accounts = data;
                });
            }

            refreshAccounts();

            $ledgers.findLedgers().then(function (data) {
                $scope.ledgers = data;
            });

            $scope.newaccount = {
                contact: contact._id,
                name: contact.name,
                ledger: null
            };

            $scope.createAccount = function () {
                var na = $scope.newaccount;
                if (na && na.contact && na.name && na.ledger) {
                    $ledgers.createLedgerAccount({
                        ledger: na.ledger._id,
                        name: na.name,
                        contact: na.contact
                    }).then(function () {
                        $scope.newaccount = {
                            contact: contact._id,
                            name: contact.name,
                            ledger: null
                        };

                        refreshAccounts();
                    });
                }
            }

            $scope.close = function () {
                $modalInstance.dismiss();
            }
        }
    ]);

    r(['domReady!'], function (document) {
        angular.bootstrap(document, ['ContactsApp']);
    });
});