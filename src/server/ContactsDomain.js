(function () {
    var domain = require('./Domain.js');
    for (i in domain) {
        module.exports[i] = domain[i];
    }

    var mongoose = require('mongoose');

    var contactSchema = new mongoose.Schema({
        name: String,
        type: {
            personeel: Boolean,
            klant: Boolean,
            leverancier: Boolean
        }
    });

    var Contact = mongoose.model('Contact', contactSchema, 'Contacts');
    module.exports['Contact'] = Contact;
})();