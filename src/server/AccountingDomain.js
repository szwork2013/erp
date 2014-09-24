(function () {
    var domain = require('./Domain.js');
    for (var i in domain) {
        module.exports[i] = domain[i];
    }

    var mongoose = require('mongoose');

    var bankAccountSchema = new mongoose.Schema({
        name: String,
        accountNumber: String
    });

    var bankAccount = mongoose.model('BankAccount', bankAccountSchema, 'BankAccounts');
    module.exports['BankAccount'] = bankAccount;


    var bankTransactionSchema = new mongoose.Schema({
        bankAccountId: mongoose.SchemaTypes.ObjectId,
        date: Date,
        amount: Number,
        message: String
    });

    var bankTransaction = mongoose.model('BankTransaction', bankTransactionSchema, 'BankTransactions');
    module.exports['BankTransaction'] = bankTransaction;

    var expenseSchema = new mongoose.Schema({
        sequence: Number,
        supplierId: mongoose.SchemaTypes.ObjectId,
        documentNumber: String,
        date: Date,
        expirationDate: Date,
        paymentMessage: String,
        netAmount: Number,
        vatAmount: Number,
        totalAmount: Number
    });

    var expense = mongoose.model('Expense', expenseSchema, 'Expenses');
    module.exports['Expense'] = expense;
})();