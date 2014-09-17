(function () {
    function registerApi(router) {
        var service = require('./TodosService.js');
        var api = require('./Api.js');

        router.route('/todos/:status?')
            .get(function (req, res, next) {
                var p = service.find(req.params.status);
                api.processResponse(p, res);
            });
    };

    module.exports = registerApi;
})();