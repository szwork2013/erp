(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./PriceCalculationsService.js');

        router.route('/pricecalculations/calculations')
            .get(function (req, res, next) {
                var p = service.findCalculations();
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createCalculation(req.body);
                api.processResponse(p, res);
            });

        router.route('/pricecalculations/calculations/:calculationId')
            .get(function (req, res, next) {
                var p = service.getCalculation(req.params.calculationId);
                api.processResponse(p, res);
            })
            .post(function (req, res, next) {
                var p = service.updateCalculation(req.params.calculationId, req.body);
                api.processResponse(p, res);
            });

        router.route('/pricecalculations/operations')
            .get(function (req, res, next) {
                var p = service.findOperations();
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createOperation(req.body.name, req.body.description, req.body.unit, req.body.resources);
                api.processResponse(p, res);
            });

        router.route('/pricecalculations/operations/:operationId')
            .post(function (req, res, next) {
                var p = service.updateOperation(req.params.operationId, req.body.name, req.body.description, req.body.unit, req.body.resources);
                api.processResponse(p, res);
            });

        router.route('/pricecalculations/resources')
            .get(function (req, res, next) {
                var p = service.findResources();
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createResource(req.body.name, req.body.group, req.body.unit);
                api.processResponse(p, res);
            });

        router.route('/pricecalculations/resources/:resourceId')
            .post(function (req, res, next) {
                var p = service.updateResource(req.params.resourceId, req.body.name, req.body.group, req.body.unit);
                api.processResponse(p, res);
            });
    }

    module.exports = registerApi;
})();