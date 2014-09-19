(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./AccountingService.js');

        router.route('/accounting/bankaccounts')
            .get(function (req, res, next) {
                var p = service.findBankAccounts();
                api.processResponse(p, res);
            });

        router.route('/accounting/bank/transactions')
            .put(function (req, res, next) {
                var p = service.createBankTransaction(req.body.bankAccountId, req.body.date, req.body.amount, req.body.message);
                api.processResponse(p, res);
            });
    }

    module.exports = registerApi;
})();