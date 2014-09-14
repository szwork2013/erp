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
    };

    module.exports = registerApi;
})();