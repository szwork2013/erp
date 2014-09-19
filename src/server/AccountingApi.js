(function () {
    function registerApi(router) {
        var api = require('./Api.js');
        var service = require('./AccountingService.js');

        router.route('/accounting/bankaccounts')
            .get(function (req, res, next) {
                var p = service.findBankAccounts();
                api.processResponse(p, res);
            })
    }

    module.exports = registerApi;
})();