(function () {
    function registerApi(router) {
        var service = require('./TodosService.js');
        var api = require('./Api.js');

        router.route('/todos/:status?')
            .get(function (req, res, next) {
                var p = service.find(req.params.status);
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.create(req.body.title, req.body.description);
                api.processResponse(p, res);
            });

        router.route('/todos/:id/:status')
            .post(function (req, res, next) {
                var p = service.updateStatus(req.params.id, req.params.status);
                api.processResponse(p, res);
            });
    };

    module.exports = registerApi;
})();