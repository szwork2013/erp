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
})();