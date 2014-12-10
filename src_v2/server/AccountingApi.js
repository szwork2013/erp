(function () {
    function registerApi(router) {
        var service = require('./AccountingService.js');
        var api = require('./Api.js');

        // rest 
        router.route('/ledgeraccounts/:id?')
            .get(function (req, res, next) {
                var p;
                if (req.params.id) {
                    p = service.getLedgerAccount(req.params.id);
                }
                else {
                    p = service.findLedgerAccounts(req.query.type);
                }

                api.processResponse(p, res);
            });

        // event handlers
        var eventDispatcher = require('./EventDispatcher.js');
        eventDispatcher.handle('contact_created', service.onContactUpdate);
        eventDispatcher.handle('contact_updated', service.onContactUpdate);
    }

    module.exports = registerApi;
})();