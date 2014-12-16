(function () {
    var domain = require('./AccountingDomain.js');
    var q = require('q');
    var eventDispatcher = require('./EventDispatcher.js');
    var _ = require('underscore');

    function AccountingService() {

    }

    AccountingService.prototype.findLedgerAccounts = function (type) {
        var d = q.defer();
        var query = {};
        if (type) {
            query.type = type;
        }

        domain.LedgerAccount.find(query).sort({ name: 'asc' }).exec(d.makeNodeResolver());

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

    AccountingService.prototype.updateExpense = function (exp) {
        var d = q.defer();

        domain.Expense.findById(exp._id, function (err, expense) {
            if (err || !expense) {
                d.reject(err);
                return;
            }

            if (expense.status == 'paid') {
                d.reject('Expense is already paid');
                return;
            }

            expense.sequence = exp.sequence;
            expense.supplier = exp.supplier._id;
            expense.date = exp.date;
            expense.expirationDate = exp.expirationDate;
            expense.documentNumber = exp.documentNumber;
            expense.paymentMessage = exp.paymentMessage;
            expense.netAmount = exp.netAmount;
            expense.vatAmount = exp.vatAmount;
            expense.totalAmount = exp.totalAmount;

            expense.save(d.makeNodeResolver());
            eventDispatcher.send('expense_updated', expense);
        });

        return d.promise;
    }

    AccountingService.prototype.findLedgerAccountBookings = function (ledgerAccountId) {
        var d = q.defer();

        domain.LedgerAccountBooking.find({ ledgerAccount: ledgerAccountId }).sort({ date: 'desc' }).exec(d.makeNodeResolver());

        return d.promise;
    }

    AccountingService.prototype.closeLedgerAccountBookings = function (bookings) {
        var d = q.defer();

        var sum = _.reduce(bookings, function (sum, b) { return sum + b.amount; }, 0);
        if (sum != 0) {
            d.reject('Sum of bookings must be 0');
            return d.promise;
        }

        function close(booking) {
            var _d = q.defer();

            if (booking.status != 'closed') {
                domain.LedgerAccountBooking.findByIdAndUpdate(booking._id, { $set: { status: 'closed'} }, function (err, b) {
                    if (err) {
                        _d.reject(err);
                        return;
                    }

                    eventDispatcher.send('ledgeraccountbooking_closed', b);
                    _d.resolve(b);
                });

                return _d.promise;
            };
        }

        var promises = _.map(bookings, close);
        return q.all(promises);
    }

    AccountingService.prototype.onBookingClose = function (booking) {
        var d = q.defer();

        if (booking && booking.expense) {
            domain.Expense.findByIdAndUpdate(booking.expense, { $set: { status: 'paid'} }, d.makeNodeResolver());
        }
        else if (booking && booking.bankTransaction) {
            domain.BankTransaction.findByIdAndUpdate(booking.bankTransaction, { $set: { status: 'paid'} }, d.makeNodeResolver());
        }
        else {
            // nothing to do...
            d.resolve();
        }

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

            domain.LedgerAccountBooking.findOne({ expense: expense._id }, function (err, exp) {
                if (err) {
                    console.error(err);
                    return;
                }

                if (!exp) {
                    exp = new domain.LedgerAccountBooking({
                        ledgerAccount: ledgerAccount._id,
                        date: expense.date,
                        amount: expense.totalAmount,
                        message: 'onkost ' + expense.sequence,
                        expense: expense._id
                    });
                }

                exp.date = expense.date;
                exp.amount = expense.totalAmount;
                exp.message = 'onkost ' + expense.sequence;

                exp.save(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        });
    };

    AccountingService.prototype.findBankStatements = function (query) {
        var d = q.defer();

        domain.BankTransaction.find({}).sort({ 'date': 'desc' }).exec(d.makeNodeResolver());

        return d.promise;
    }

    AccountingService.prototype.importBankTransactions = function (path) {
        var d = q.defer();

        function parseDate(str) {
            var split = str.split('/');
            return new Date(split[2], split[1] - 1, split[0], 0, 0, 0);
        }

        var regex = [
            {
                regex: new RegExp(/^EUROPESE OVERSCHRIJVING NAAR (.*) BANKIER BEGUNSTIGDE: ([a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?) (.*) DOORGEGEVEN OP [0-9\-]{8,10} MET KBC-ONLINE FOR BUSINESS \/ ISABEL/),
                parse: function (match) {
                    return {
                        type: 'credit-transfer',
                        creditorAccountNumber: match[1].replace(' ', ''),
                        message: match[4]
                    };
                }
            },
            {
                regex: new RegExp(/^EUROPESE OVERSCHRIJVING VAN (.*) BANKIER OPDRACHTGEVER: ([a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?) (.*)/),
                parse: function (match) {
                    return {
                        type: 'credit-transfer',
                        debtorAccountNumber: match[1],
                        message: match[4]
                    };
                }
            },
            {
                regex: new RegExp(/^EUROPESE DOMICILIERING( B2B)? SCHULDEISER(\s*): (.*) REF\. SCHULDEISER: (.*) MANDAATREFERTE(\s*): (.*) EIGEN OMSCHR\.(\s*): (.*) MEDEDELING[\s]{0,}: (.*)/),
                parse: function (match) {
                    return {
                        type: 'direct-debit',
                        creditor: match[3],
                        creditorReference: match[4],
                        creditorMandateReference: match[6],
                        creditorDescription: match[8],
                        message: match[9]
                    };
                }
            }
        ];

        var csv = require('ya-csv');
        var reader = csv.createCsvFileReader(path, {
            columnsFromHeader: true,
            separator: ';',
            quote: '"'
        });

        reader.on('data', function (record) {
            var trans = new domain.BankTransaction({
                account: record.Rekeningnummer,
                date: parseDate(record.Datum),
                valueDate: parseDate(record.Valuta),
                message: record.Omschrijving,
                amount: parseFloat(record.Bedrag.replace(',', '.'))
            });

            for (var i = 0; i < regex.length; i++) {
                var r = regex[i];
                var match = record.Omschrijving.match(r.regex);
                if (match) {
                    trans.info = r.parse(match);
                    break;
                }
            }

            trans.save(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });

        reader.on('error', function (err) {
            d.reject(err);
        });

        reader.on('end', function () {
            d.resolve();
        });

        return d.promise;
    };

    AccountingService.prototype.bookBankTransaction = function (transactionId, ledgerAccountId) {
        var d = q.defer();

        domain.BankTransaction.findById(transactionId, function (err, transaction) {
            if (err) {
                return d.reject(err);
            }

            new domain.LedgerAccountBooking({
                ledgerAccount: ledgerAccountId,
                date: transaction.date,
                amount: transaction.amount,
                message: 'betaling via bank',
                bankTransaction: transaction._id
            }).save(function (err) {
                if (err) {
                    return d.reject(err);
                }

                transaction.status = 'booked';
                transaction.save(d.makeNodeResolver());
            });
        });

        return d.promise;
    };

    module.exports = new AccountingService();
})();