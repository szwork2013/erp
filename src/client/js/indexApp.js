var indexApp = angular.module('IndexApp', []);

indexApp.controller('TodosViewController', [
    '$scope',
    '$http',
    function ($scope, $http) {
        var todosRequest = $http.get('/api/todos');
        todosRequest.success(function (data) {
            $scope.todos = data;
        });
    }
]);