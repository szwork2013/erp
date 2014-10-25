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

    AccountingService.prototype.findLedgerAccounts = function () {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);
        this.domain.LedgerAccount.find({}, c);
        return d.promise;
    };

    AccountingService.prototype.createLedgerAccount = function (ledger, name) {
        var d = this.q.defer();
        var c = this.service.createDbCallback(d);
        var la = new this.domain.LedgerAccount({ ledger: ledger, name: name });
        la.save(c);
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

    AccountingService.prototype.saveLedgerAccountBookings = function (request) {
        var self = this;

        // todo add check for total sum (= domain logic)

        function deleteBankTransactionBookings(bankTransactionId, bookings) {
            var d = self.q.defer();

            self.domain.LedgerAccountBooking.find({ bankTransaction: bankTransactionId }).remove(function (err) {
                if (err) {
                    d.reject(err);
                }
                else {
                    d.resolve({ bankTransaction: bankTransactionId, bookings: bookings });
                }
            });

            return d.promise;
        }

        function insertBankTransactionBookings(args) {
            var promises = [];
            for (var idx = 0; idx < bookings.length; idx++) {
                promises.push(insertBankTransactionBooking(args.bankTransaction, bookings[idx]));
            }

            return self.q.all(promises);
        }

        function insertBankTransactionBooking(bankTransaction, booking) {
            var d = self.q.defer();

            booking.bankTransaction = bankTransaction;
            if (booking.ledgerAccount._id) {
                booking.ledgerAccount = booking.ledgerAccount._id;
            }

            var b = new self.domain.LedgerAccountBooking(booking);
            b.save(function (err) {
                if (err) {
                    d.reject(err);
                }
                else {
                    d.resolve();
                }
            });

            return d.promise;
        }

        if (request.bankTransactionId) {
            return deleteBankTransactionBookings(request.bankTransactionId).then(insertBankTransactionBookings, function () {
                return deleteBankTransactionBookings(request.bankTransactionId, []);
            });
        }
        else {
            throw new Error('Not implemented yet!');
        }
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
        var me = this;

        var sp = this.domain.nextValue('expenses');
        sp.then(function (seq) {
            expense.sequence = seq;
            var ex = new me.domain.Expense(expense);

            ex.save(function (err) {
                if (err) {
                    d.reject(err);
                }
                else {
                    console.error('done');
                    d.resolve(ex);
                }
            });
        }, function (err) {
            d.reject(err);
        });

        return d.promise;
    }

    module.exports = new AccountingService();
})();