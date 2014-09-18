var indexApp = angular.module('IndexApp', []);

indexApp.controller('TodosViewController', [
    '$scope',
    '$http',
    function ($scope, $http) {
        $scope.newTodo = { title: '', description: '', status: 'not done' };

        var refreshTodos = function () {
            $scope.todos = {};
            var notDoneRequest = $http.get('/api/todos/not%20done');
            notDoneRequest.success(function (data) {
                $scope.todos['notdone'] = data;
            });

            var busyRequest = $http.get('/api/todos/busy');
            busyRequest.success(function (data) {
                $scope.todos['busy'] = data;
            });
        }

        refreshTodos();

        $scope.addTodo = function () {
            var addRequest = $http.put('/api/todos', $scope.newTodo);
            addRequest.success(function (data) {
                $scope.newTodo = { title: '', description: '', status: 'not done' };
                refreshTodos();
            });
        }

        $scope.markBusy = function (id) {
            setStatus(id, 'busy');
        }

        $scope.markDone = function (id) {
            setStatus(id, 'done');
        }

        var setStatus = function (id, status) {
            var request = $http.post('/api/todos/' + id + '/' + status);
            request.success(function (data) {
                refreshTodos();
            });
        }
    }
]);