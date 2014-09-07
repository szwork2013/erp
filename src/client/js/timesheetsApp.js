var timesheetsApp = angular.module('TimesheetsApp', ['ngRoute', 'ui.bootstrap']);

timesheetsApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
		.when('/overview', {
		    templateUrl: 'timesheets/overview.partial.html',
		    controller: 'OverviewController'
		})
        .when('/input', {
            templateUrl: 'timesheets/input.partial.html',
            controller: 'InputController'
        })
		.otherwise({
		    redirectTo: '/overview'
		});
} ]);

timesheetsApp.controller('OverviewController', [
    '$scope',
    '$http',
    function ($scope, $http) {
        var employees = {};
        var employeesRequest = $http.get('/api/contacts/Werknemer');
        employeesRequest.success(function (data) {
            employees = {};
            for ($i = 0; $i < data.length; $i++) {
                employees[data[$i]._id] = data[$i];
            }
        });

        var projects = {};
        var projectsRequest = $http.get('/api/projects');
        projectsRequest.success(function (data) {
            projects = {};
            for ($i = 0; $i < data.length; $i++) {
                projects[data[$i].id] = data[$i];
            }
        });

        var timeregistrations = [];
        var trRequest = $http.get('/api/timeregistration');
        trRequest.success(function (data) {
            timeregistrations = data;

            for ($i = 0; $i < timeregistrations.length; $i++) {
                timeregistrations[$i].project = projects[timeregistrations[$i].project];
                timeregistrations[$i].employee = employees[timeregistrations[$i].employee];
            }

            $scope.timeregistrations = timeregistrations;
        });
    }
]);

    timesheetsApp.controller('InputController', [
    '$scope',
    '$http',
    function ($scope, $http) {
        $scope.employee = undefined;
        $scope.project = undefined;
        $scope.date = new Date();

        $scope.employees = [];
        var employeesRequest = $http.get('/api/contacts/Werknemer');
        employeesRequest.success(function (data) {
            $scope.employees = data;
        });

        $scope.projects = [];
        var projectsRequest = $http.get('/api/projects');
        projectsRequest.success(function (data) {
            $scope.projects = data;
        });

        $scope.add = function () {
            var tr = {};
            tr.employee = $scope.employee._id;
            tr.date = $scope.date;
            tr.project = $scope.project.id;
            tr.hours = $scope.hours;
            tr.description = $scope.description;

            var req = $http.post('/api/timeregistration', tr);
            req.success(function () {
                $scope.hours = undefined;
                $scope.description = undefined;
            });
        };
    }
]);