(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./ProjectsService.js');

        var projectsRoute = router.route('/projects');
        projectsRoute.get(function (req, res, next) {
            var p = service.findProjects();
            api.processResponse(p, res);
        });

        projectsRoute.put(function (req, res, next) {
            var p = service.createProject(req.body.name);
            api.processResponse(p, res);
        });

        projectsRoute.post(function (req, res, next) {
            var p = service.updateProject(req.body);
            api.processResponse(p, res);
        });

        var projectRoute = router.route('/projects/:projectId');
        projectRoute.get(function (req, res, next) {
            var p = service.getProject(req.params.projectId);
            api.processResponse(p, res);
        });

        var workItemsRoute = router.route('/projects/:projectId/workitems');
        workItemsRoute.get(function (req, res, next) {
            var p = service.findWorkItems(req.params.projectId);
            api.processResponse(p, res);
        });

        var workItemRoute = router.route('/projects/:projectId/workitems/:workItemId');
        workItemRoute.get(function (req, res, next) {
            var p = service.getWorkItem(req.params.projectId, req.params.workItemId);
            api.processResponse(p, res);
        })

        router.route('/projects/workitems').put(function (req, res, next) {
            var p = service.createWorkItem(req.body.projectId, req.body.name, req.body.description);
            api.processResponse(p, res);
        });
    };

    module.exports = registerApi;
})();