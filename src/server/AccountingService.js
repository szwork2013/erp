(function () {
    function AccountingService() {
        this.q = require('q');
        this.domain = require('./AccountingDomain.js');
        this.service = require('./Service.js');
    }

    AccountingService.prototype.findLedgers = function () {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);
        this.domain.Ledger.find({}, c);
        return d.promise;
    };

    AccountingService.prototype.createLedger = function (name) {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);
        var l = new this.domain.Ledger({ name: name });
        l.save(c);
        return d.promise;
    }

    AccountingService.prototype.findLedgerAccounts = function (query) {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);

        var q = {};
        if (query) {
            if (query.contact) {
                q.contact = query.contact;
            }
        }

        this.domain.LedgerAccount.find(q).populate('ledger').exec(c);
        return d.promise;
    };

    AccountingService.prototype.createLedgerAccount = function (account) {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);
        var la = new this.domain.LedgerAccount({ ledger: account.ledger, name: account.name, contact: account.contact });
        la.save(c);
        return d.promise;
    };

    AccountingService.prototype.getLedgerAccount = function (id) {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);
        var la = this.domain.LedgerAccount.findOne({ '_id': id }).populate('ledger').exec(c);
        return d.promise;
    };

    AccountingService.prototype.findLedgerAccountBookings = function (params) {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);

        var query = {};
        if (params.bankTransactionId) {
            query.bankTransaction = params.bankTransactionId
        }

        this.domain.LedgerAccountBooking.find(query).populate('ledgerAccount').exec(c);

        return d.promise;
    };

    AccountingService.prototype.saveLedgerAccountBookings = function (bookings) {
        var self = this;
        function insertBooking(booking) {
            try {
                if (booking.ledgerAccount && booking.ledgerAccount._id) {
                    booking.ledgerAccount = booking.ledgerAccount._id;
                }

                var d = self.q.defer();
                var c = self.service.createDbCallback(d);
                var b = new self.domain.LedgerAccountBooking(booking);
                b.save(c);
                return d.promise;
            }
            catch (ex) {
                console.error(ex);
            }
        }

        var promises = [];
        for (var i in bookings) {
            promises.push(insertBooking(bookings[i]));
        }

        return this.q.all(promises);
    };

    AccountingService.prototype.findBankAccounts = function () {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);
        this.domain.BankAccount.find({}, c);
        return d.promise;
    };

    AccountingService.prototype.findBankTransactions = function (pageSize) {
        var d = this.q.defer();

        var query = this.domain.BankTransaction.find({}).sort({ date: 'desc' });
        if (pageSize) {
            query = query.limit(pageSize);
        }

        var c = this.service.createDbCallback(d);
        query.exec(c);

        return d.promise;
    }

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

    AccountingService.prototype.findExpenses = function (pageSize, query) {
        var d = this.q.defer();

        var query = this.domain.Expense.find(query).populate('supplier').sort({ sequence: 'desc' });
        if (pageSize) {
            query = query.limit(pageSize);
        }

        var c = this.service.createDbCallback(d);
        query.exec(c);

        return d.promise;
    }

    AccountingService.prototype.createExpense = function (expense) {
        var d = this.q.defer();

        if (expense.supplier && expense.supplier._id) {
            expense.supplier = expense.supplier._id;
        }

        var ex = new this.domain.Expense(expense);
        ex.save(function (err) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(ex);
            }
        });

        return d.promise;
    }

    module.exports = new AccountingService();
})();