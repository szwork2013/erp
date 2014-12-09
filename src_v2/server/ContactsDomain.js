(function () {
    var mongoose = require('mongoose');

    var contactSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        type: {
            employee: { type: Boolean, required: true, 'default': false },
            customer: { type: Boolean, required: true, 'default': false },
            supplier: { type: Boolean, required: true, 'default': false }
        }
    });

    module.exports['Contact'] = mongoose.model('Contact', contactSchema, 'Contacts');
})();