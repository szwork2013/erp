(function () {
    var mongoose = require('mongoose');

    var ExpenseSchema = new mongoose.Schema({
        number: { type: Number, required: true, unique: true },
        supplier: { type: String, required: true },
        date: { type: Date, required: true },
        expirationDate: { type: Date, required: true },
        documentNumber: { type: String },
        paymentMessage: { type: String },
        netAmount: { type: Number, required: true },
        vatAmount: { type: Number, required: true },
        totalAmount: { type: Number, required: true }
    });

    var Expense = mongoose.model('Expense', ExpenseSchema, 'Expenses');

    module.exports['Expense'] = Expense;
})();