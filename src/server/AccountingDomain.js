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

    var bankAccount = mongoose.model('BankAccount', bankAccountSchema, 'BankAccounts');
    module.exports['BankAccount'] = bankAccount;

    var bankTransactionSchema = new mongoose.Schema({
        bankAccountId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'BankAccount' },
        date: { type: Date, required: true },
        valueDate: { type: Date },
        message: { type: String },
        amount: { type: Number, required: true, 'default': 0.0 },
        info: { type: mongoose.SchemaTypes.Mixed },
        booked: { type: Boolean, 'default': false }
    });

    var bankTransaction = mongoose.model('BankTransaction', bankTransactionSchema, 'BankTransactions');
    module.exports['BankTransaction'] = bankTransaction;

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
        outstandingBalance: { type: Number }
    });

    var expense = mongoose.model('Expense', expenseSchema, 'Expenses');
    module.exports['Expense'] = expense;

    //var expensePaymentSchema = new mongoose.Schema({
    //    expense: { type: mongoose.SchemaTypes.ObjectId, ref: 'Expense', required: true },
    //    bankTransaction: { type: mongoose.SchemaTypes.ObjectId, ref: 'BankTransaction', required: true },
    //    amount: { type: Number, required: true }
    //});

    //var expensePayment = mongoose.model('ExpensePayment', expensePaymentSchema, 'ExpensePayments');
    //module.exports['ExpensePayment'] = expensePayment;
})();