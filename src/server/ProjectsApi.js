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

        var projectRoute = router.route('/projects/:projectId');
        projectRoute.get(function (req, res, next) {
            var p = service.getProject(req.params.projectId);
            api.processResponse(p, res);
        });
    };

    //    .get(function (req, res, next) {
    //    try {
    //        var page = req.param('page') || 0;
    //        projectService.findProjects(page, function (result) {
    //            res.status(200).json(result);
    //        });
    //    }
    //    catch (e) {
    //        console.log(e);
    //        res.status(500).end();
    //    }
    //})
    //.post(function (req, res, next) {
    //    try {
    //        projectService.saveProject(req.body, function (result) {
    //            res.status(200).end();
    //        });
    //    }
    //    catch (e) {
    //        console.log(e);
    //        res.status(500).end();
    //    }
    //});

    //  };

    module.exports = registerApi;
})();