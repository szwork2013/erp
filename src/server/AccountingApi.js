(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./AccountingService.js');

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
                var p = service.findExpenses(req.params.pageSize);
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createExpense(req.body);
                api.processResponse(p, res);
            });
    }

    module.exports = registerApi;
})();