(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./PricesService.js');

        router.route('/prices')
            .get(function (req, res, next) {
                var p = service.findPrices();
                api.processResponse(p, res);
            });
    }

    module.exports = registerApi;
})();