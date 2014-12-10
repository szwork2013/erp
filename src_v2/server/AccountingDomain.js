(function () {
    var contactsDomain = require('./ContactsDomain.js');
    for (var i in contactsDomain) {
        module.exports[i] = contactsDomain[i];
    }

    var mongoose = require('mongoose');

    var ledgerAccountSchema = new mongoose.Schema({
        name: { type: String, required: true },
        type: { type: String, required: true },
        contact: { type: mongoose.SchemaTypes.ObjectId, ref: 'Contact', required: false }
    });

    module.exports['LedgerAccount'] = mongoose.model('LedgerAccount', ledgerAccountSchema, 'LedgerAccounts');
    
    var expenseSchema = new mongoose.Schema({
        sequence: { type: Number, required: true, unique: true },
        supplier: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Contact' },
        date: { type: Date, required: true },
        expirationDate: { type: Date, required: true },
        documentNumber: { type: String },
        paymentMessage: { type: String },
        netAmount: { type: Number, required: true },
        vatAmount: { type: Number, required: true },
        totalAmount: { type: Number, required: true }
    });

    module.exports['Expense'] = mongoose.model('Expense', expenseSchema, 'Expenses');

    var ledgerAccountBookingSchema = new mongoose.Schema({
        ledgerAccount: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'LedgerAccount' },
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
        message: { type: String, required: true },
        expense: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'Expense' }
    });

    module.exports['LedgerAccountBooking'] = mongoose.model('LedgerAccountBooking', ledgerAccountBookingSchema, 'LedgerAccountBookings');
})();