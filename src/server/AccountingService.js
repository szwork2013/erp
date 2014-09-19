(function () {
    function AccountingService() {
        this.q = require('q');
        this.domain = require('./AccountingDomain.js');
        this.service = require('./Service.js');
    }

    AccountingService.prototype.findBankAccounts = function () {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);
        this.domain.BankAccount.find({}, c);
        return d.promise;
    };

    module.exports = new AccountingService();
})();