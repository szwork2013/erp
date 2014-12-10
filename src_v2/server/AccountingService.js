(function () {
    var domain = require('./AccountingDomain.js');
    var q = require('q');
    var eventDispatcher = require('./EventDispatcher.js');

    function AccountingService() {

    }

    AccountingService.prototype.findLedgerAccounts = function (type) {
        var d = q.defer();
        var query = {};
        if (type) {
            query.type = type;
        }

        domain.LedgerAccount.find(query, d.makeNodeResolver());

        return d.promise;
    }

    AccountingService.prototype.getLedgerAccount = function (id) {
        var d = q.defer();
        domain.LedgerAccount.findById(id, d.makeNodeResolver());
        return d.promise;
    }

    AccountingService.prototype.onContactUpdate = function (contact) {

        var promises = [];

        var findAndUpdate = function (type) {
            var d = q.defer();
            domain.LedgerAccount.findOne({ contact: contact._id, type: type }, function (err, la) {
                if (err) {
                    d.reject(err);
                    return;
                }

                if (!la) {
                    la = new domain.LedgerAccount({ type: type, contact: contact._id });
                }

                la.name = contact.name;
                la.save(d.makeNodeResolver());
            });

            return d.promise;
        }

        if (contact.type.customer) {
            promises.push(findAndUpdate('customer'));
        }

        if (contact.type.supplier) {
            promises.push(findAndUpdate('supplier'));
        }

        if (!contact.type.customer && !contact.type.supplier) {
            var d = q.defer();
            d.resolve();
            promises.push(d.promise);
        }

        return q.all(promises);
    }

    AccountingService.prototype.findExpenses = function (query) {
        var d = q.defer();

        var query = domain.Expense.find(query).populate('supplier').sort({ sequence: 'desc' });
        query.exec(d.makeNodeResolver());

        return d.promise;
    }

    AccountingService.prototype.createExpense = function (exp) {
        var d = q.defer();

        exp.supplier = exp.supplier._id;
        new domain.Expense(exp).save(function (err, ex) {
            if (err) {
                d.reject(err);
                return;
            }

            eventDispatcher.send('expense_created', ex);
            d.resolve(ex);
        });

        return d.promise;
    }

    AccountingService.prototype.findLedgerAccountBookings = function (ledgerAccountId) {
        var d = q.defer();

        domain.LedgerAccountBooking.find({ ledgerAccount: ledgerAccountId }).sort({ date: 'desc' }).exec(d.makeNodeResolver());

        return d.promise;
    }

    AccountingService.prototype.onExpenseUpdate = function (expense) {
        domain.LedgerAccount.findOne({ type: 'supplier', contact: expense.supplier }, function (err, ledgerAccount) {
            if (err) {
                console.error(err);
                return;
            }

            if (!ledgerAccount) {
                console.error('ledgeraccount not found for expense ' + expense._id + ' ' + expense.sequence);
                return;
            }

            new domain.LedgerAccountBooking({
                ledgerAccount: ledgerAccount._id,
                date: expense.date,
                amount: expense.totalAmount,
                message: 'onkost ' + expense.sequence,
                expense: expense._id
            }).save(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    }

    module.exports = new AccountingService();
})();