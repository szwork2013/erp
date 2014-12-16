(function () {
    function registerApi(router) {
        var service = require('./AccountingService.js');
        var api = require('./Api.js');

        router.use(require('connect-multiparty')());

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

        router.route('/ledgeraccountbookings/close')
            .put(function (req, res, next) {
                var p = service.closeLedgerAccountBookings(req.body);
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
            })
            .post(function (req, res, next) {
                var p = service.updateExpense(req.body);
                api.processResponse(p, res);
            });

        router.route('/bank/transactions')
            .get(function (req, res, next) {
                var p = service.findBankStatements(req.query);
                api.processResponse(p, res);
            })
            .post(function (req, res, next) {
                if (req.files && req.files.file) {
                    var p = service.importBankTransactions(req.files.file.path);
                    api.processResponse(p, res);
                }
                else {
                    res.status(200).end('ok');
                }
            });

        router.route('/bank/booking')
            .put(function (req, res, next) {
                var p = service.bookBankTransaction(req.body.transaction, req.body.ledgerAccount);
                api.processResponse(p, res);
            });

        // event handlers
        var eventDispatcher = require('./EventDispatcher.js');
        eventDispatcher.handle('contact_created', service.onContactUpdate);
        eventDispatcher.handle('contact_updated', service.onContactUpdate);
        eventDispatcher.handle('expense_created', service.onExpenseUpdate);
        eventDispatcher.handle('expense_updated', service.onExpenseUpdate);
        eventDispatcher.handle('ledgeraccountbooking_closed', service.onBookingClose);
    }

    module.exports = registerApi;
})();