(function () {
    var domain = require('./Domain.js');
    for (i in domain) {
        module.exports[i] = domain[i];
    }

    var mongoose = require('mongoose');

    var contactSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        type: {
            employee: { type: Boolean, required: true, 'default': false },
            customer: { type: Boolean, required: true, 'default': false },
            supplier: { type: Boolean, required: true, 'default': false }
        }
    });

    var Contact = mongoose.model('Contact', contactSchema, 'Contacts');
    module.exports['Contact'] = Contact;
})();