(function () {
    var domain = require('./Domain.js');
    for (var i in domain) {
        module.exports[i] = domain[i];
    }

    var contactsDomain = require('./ContactsDomain.js');
    for (var i in contactsDomain) {
        module.exports[i] = contactsDomain[i];
    }

    var mongoose = require('mongoose');

    var bankAccountSchema = new mongoose.Schema({
        accountNumber: { type: String, required: true, unique: true },
        name: { type: String, required: true }
    });

    var bankTransactionSchema = new mongoose.Schema({
        bankAccountId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'BankAccount' },
        date: { type: Date, required: true },
        valueDate: { type: Date },
        message: { type: String },
        amount: { type: Number, required: true, 'default': 0.0 },
        info: { type: mongoose.SchemaTypes.Mixed },
        booked: { type: Boolean, 'default': false }
    });

    var expenseSchema = new mongoose.Schema({
        sequence: { type: Number, required: true, unique: true },
        supplier: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Contact' },
        date: { type: Date, required: true },
        expirationDate: { type: Date, required: true },
        documentNumber: { type: String },
        paymentMessage: { type: String },
        netAmount: { type: Number, required: true },
        vatAmount: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        outstandingBalance: { type: Number, required: false }
    });

    var ledgerAccountSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true }
    });

    var bankTransactionBookingSchema = new mongoose.Schema({
        bankTransaction: { type: mongoose.SchemaTypes.ObjectId, ref: 'BankTransaction', required: true },
        ledgerAccount: { type: mongoose.SchemaTypes.ObjectId, ref: 'LedgerAccount', required: true },
        note: { type: String },
        amount: { type: Number, required: true }
    });

    module.exports['BankAccount'] = mongoose.model('BankAccount', bankAccountSchema, 'BankAccounts');
    module.exports['Expense'] = mongoose.model('Expense', expenseSchema, 'Expenses');
    module.exports['BankTransaction'] = mongoose.model('BankTransaction', bankTransactionSchema, 'BankTransactions');
    module.exports['LedgerAccount'] = mongoose.model('LedgerAccount', ledgerAccountSchema, 'LedgerAccounts');
    module.exports['BankTransactionBooking'] = mongoose.model('BankTransactionBooking', bankTransactionBookingSchema, 'BankTransactionBookings');
})();