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
})();