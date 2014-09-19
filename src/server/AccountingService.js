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

    AccountingService.prototype.createBankTransaction = function (bankAccountId, date, amount, message) {
        var d = this.q.defer();

        var transaction = new this.domain.BankTransaction({
            bankAccountId: bankAccountId,
            date: date,
            amount: amount,
            message: message
        });

        transaction.save(function (err) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(transaction);
            }
        })

        return d.promise;
    }

    module.exports = new AccountingService();
})();