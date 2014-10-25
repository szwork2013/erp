(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./AccountingService.js');

        router.route('/accounting/ledgers')
            .get(function (req, res, next) {
                var p = service.findLedgers();
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createLedger(req.body.name);
                api.processResponse(p, res);
            });

        router.route('/accounting/ledgeraccounts')
            .get(function (req, res, next) {
                var p = service.findLedgerAccounts();
                api.processResponse(p, res);
            });

        router.route('/accounting/ledgeraccountbookings')
            .get(function (req, res, next) {
                var p = service.findLedgerAccountBookings(req.query);
                api.processResponse(p, res);
            })
            .post(function (req, res, next) {
                var p = service.saveLedgerAccountBookings(req.body);
                api.processResponse(p, res);
            });

        router.route('/accounting/bank/accounts')
            .get(function (req, res, next) {
                var p = service.findBankAccounts();
                api.processResponse(p, res);
            });

        router.route('/accounting/bank/transactions/:pageSize?')
            .get(function (req, res, next) {
                var p = service.findBankTransactions(req.params.pageSize);
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createBankTransaction(req.body.bankAccountId, req.body.date, req.body.amount, req.body.message);
                api.processResponse(p, res);
            });

        router.route('/accounting/expenses/:pageSize?')
            .get(function (req, res, next) {
                var p = service.findExpenses(req.params.pageSize, req.query);
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createExpense(req.body);
                api.processResponse(p, res);
            });
    }

    module.exports = registerApi;
})();