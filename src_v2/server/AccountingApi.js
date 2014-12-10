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

        router.route('/ledgeraccountbookings/:ledgerAccountId')
            .get(function (req, res, next) {
                var p = service.findLedgerAccountBookings(req.params.ledgerAccountId);
                api.processResponse(p, res);
            });

        router.route('/expenses')
            .get(function (req, res, next) {
                var p = service.findExpenses(req.query);
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createExpense(req.body);
                api.processResponse(p, res);
            });

        // event handlers
        var eventDispatcher = require('./EventDispatcher.js');
        eventDispatcher.handle('contact_created', service.onContactUpdate);
        eventDispatcher.handle('contact_updated', service.onContactUpdate);
        eventDispatcher.handle('expense_created', service.onExpenseUpdate);
    }

    module.exports = registerApi;
})();