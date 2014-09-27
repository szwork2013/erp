(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./PricesService.js');

        router.route('/prices')
            .get(function (req, res, next) {
                var p = service.findPrices();
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createPrice(req.body.name, req.body.unit, req.body.price);
                api.processResponse(p, res);
            });

        router.route('/prices/:id')
            .post(function (req, res, next) {
                var p = service.updatePrice(req.params.id, req.body.name, req.body.unit, req.body.price);
                api.processResponse(p, res);
            });
    }

    module.exports = registerApi;
})();