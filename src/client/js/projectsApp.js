var projectsApp = angular.module('ProjectsApp', ['ngRoute']);

projectsApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/overview/:page?', {
			templateUrl: 'projects/index.partial.html',
			controller: 'ProjectsOverviewController'
		})
		.when('/create', {
			templateUrl: 'projects/create.partial.html',
			controller: 'CreateProjectController'
		})
		.when('/:id', {
			templateUrl: 'projects/details.partial.html',
			controller: 'ProjectDetailController'
		})
		.when('/:id/workitems', {
			templateUrl: 'projects/workitem/index.partial.html',
			controller: 'ProjectWorkItemsController'
		})
		.when('/:id/workitems/create', {
			templateUrl: 'projects/workitem/create.partial.html',
			controller: 'ProjectCreateWorkItemController'
		})
		.when('/:id/workitems/:workitemid', {
			templateUrl: 'projects/workitem/detail.partial.html',
			controller: 'ProjectWorkItemDetailController'
		})
		.when('/:id/workitems/:workitemid/materials', {
			templateUrl: 'projects/workitem/materials.partial.html',
			controller: 'ProjectWorkItemMaterialsController'
		})
		.when('/:id/workitems/:workitemid/tasks', {
			templateUrl: 'projects/workitem/tasks.partial.html',
			controller: 'ProjectWorkItemTasksController'
		})
		.otherwise({
			redirectTo: '/overview'
		});
}]);

projectsApp.controller('ProjectsOverviewController', [
	'$scope',
	'$http',
	'$routeParams',
	function($scope, $http, $routeParams) {
		var page = $routeParams.page || 0;
		
		var projectsRequest = $http.get('/api/projects?page=' + page);
		projectsRequest.success(function(data) {
			$scope.projects = data;
		});
	}
]);

projectsApp.controller('CreateProjectController', [
	'$scope',
	'$http',
	'$location',
	function($scope, $http, $location) {
		$scope.create = function() {
			$scope.error = '';
			
			if (!$scope.name) {
				$scope.error = "Kies een naam voor het nieuwe project";
			}
			else {
				var createRequest = $http.put('/api/projects', { name : $scope.name});
				createRequest.success(function(data) {
					$location.path('/' + data.id);
				})
				.error(function(data, status) {
					alert(status + ' ' + data);
				});
			}
		};
	}
]);

projectsApp.controller('ProjectDetailController', [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {
		var projectRequest = $http.get('/api/projects/' + $routeParams.id);
		projectRequest.success(function(data) {
			$scope.project = data;
			
			$scope.save = function() {
				var saveRequest = $http.post('/api/projects', $scope.project);
				saveRequest.success(function(data) {
					$scope.saveconfirm = "Wijzigingen opgeslaan";
				});
			};
		});
	}
]);

projectsApp.controller('ProjectWorkItemsController', [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {
		var projectRequest = $http.get('/api/projects/' + $routeParams.id);
		projectRequest.success(function(data) {
			$scope.project = data;
		});
		
		var workitemsRequest = $http.get('/api/projects/' + $routeParams.id + '/workitems');
		workitemsRequest.success(function(data) {
			$scope.workitems = data;
		});
	}
]);

projectsApp.controller('ProjectCreateWorkItemController', [
	'$scope',
	'$http', 
	'$routeParams',
	'$location',
	function($scope, $http, $routeParams, $location) {
		$scope.name = '';
		$scope.description = '';
	
		var projectRequest = $http.get('/api/projects/' + $routeParams.id);
		projectRequest.success(function(data) {
			$scope.project = data;
			
			$scope.save = function() {
				var workItem = {
					projectId: $scope.project.id,
					name: $scope.name,
					description: $scope.description
				};
				
				var createRequest = $http.put('/api/projects/workitems', workItem);
				createRequest.success(function(data) {
					$location.path('/' + $scope.project.id + '/workitems');
				});
			};
		});
	}
]);

projectsApp.controller('ProjectWorkItemDetailController', [
	'$scope',
	'$http',
	'$routeParams',
	function($scope, $http, $routeParams) {
		var projectRequest = $http.get('/api/projects/' + $routeParams.id);
		projectRequest.success(function(data){
			$scope.project = data;
		});
		
		var workItemRequest = $http.get('/api/projects/' + $routeParams.id + '/workitems/' + $routeParams.workitemid);
		workItemRequest.success(function(data) {
			$scope.workitem = data;
		});
	}
]);

	projectsApp.controller('ProjectWorkItemMaterialsController', [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {
	    var projectRequest = $http.get('/api/projects/' + $routeParams.id);
	    projectRequest.success(function (data) {
	        $scope.project = data;
	    });

	    var workItemRequest = $http.get('/api/projects/' + $routeParams.id + '/workitems/' + $routeParams.workitemid);
	    workItemRequest.success(function (data) {
	        $scope.workitem = data;
	    });

	    var unitsRequest = $http.get('/api/referenceData/units');
	    unitsRequest.success(function (data) {
	        $scope.units = data;
	    });

	    $scope.materials = [];
	    $scope.addMaterial = function () {
	        $scope.materials.splice(0, 0, { source: null, name: '', quantity: 0, unit: '' });
	    };

	    $scope.saveMaterials = function () {
	        alert('not implemented yet, but ' + $scope.materials.length + ' materials detected');
	    };
	}
]);

	projectsApp.controller('ProjectWorkItemTasksController', [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {
	    var projectRequest = $http.get('/api/projects/' + $routeParams.id);
	    projectRequest.success(function (data) {
	        $scope.project = data;
	    });

	    var workItemRequest = $http.get('/api/projects/' + $routeParams.id + '/workitems/' + $routeParams.workitemid);
	    workItemRequest.success(function (data) {
	        $scope.workitem = data;
	    });
	}
]);