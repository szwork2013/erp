(function () {
    var mongoose = require('mongoose');

    var contactTypeSchema = new mongoose.Schema({
        name: String
    });

    var ContactType = mongoose.model('ContactType', contactTypeSchema, 'ContactTypes');

    module.exports['ContactType'] = ContactType;
})();