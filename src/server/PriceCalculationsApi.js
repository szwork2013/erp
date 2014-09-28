(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./PriceCalculationsService.js');

        router.route('/pricecalculations/operations')
            .get(function (req, res, next) {
                var p = service.findOperations();
                api.processResponse(p, res);
            });

        router.route('/pricecalculations/calculations')
            .put(function (req, res, next) {
                var p = service.createCalculation(req.body);
                api.processResponse(p, res);
            });
    }

    module.exports = registerApi;
})();