(function () {
    var domain = require('./Domain.js');
    for (i in domain) {
        module.exports[i] = domain[i];
    }

    var mongoose = require('mongoose');

    var contactTypeSchema = new mongoose.Schema({
        name: String
    });

    var ContactType = mongoose.model('ContactType', contactTypeSchema, 'ContactTypes');
    module.exports['ContactType'] = ContactType;

    var contactSchema = new mongoose.Schema({
        name: String,
        type: [mongoose.Schema.Types.ObjectId]
    });

    var Contact = mongoose.model('Contact', contactSchema, 'Contacts');
    module.exports['Contact'] = Contact;
})();