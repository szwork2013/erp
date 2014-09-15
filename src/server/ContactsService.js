(function () {

    function ContactService() {
        this.q = require('q');
        this.domain = require('./ContactsDomain.js');
        this.service = require('./Service.js');
    }

    ContactService.prototype.findTypes = function () {
        var d = this.q.defer();

        var c = this.service.createDbCallback(d);
        console.log(c);
        this.domain.ContactType.find({}, c);

        return d.promise;
    }

    ContactService.prototype.findContacts = function (type) {
        var query = {};
        if (type) {
            query.type = type;
        }

        var d = this.q.defer();

        var c = this.service.createDbCallback(d);
        this.domain.Contact.find(query, c);

        return d.promise;
    };

    ContactService.prototype.createContact = function (name, types) {
        var d = this.q.defer();

        var typeIds = [];
        for (var idx = 0; idx < types.length; idx++) {
            typeIds.push(this.domain.createObjectId(types[idx]));
        }

        var contact = new this.domain.Contact({ name: name, type: typeIds });
        contact.save(function (err) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(contact);
            }
        })

        return d.promise;
    }

    module.exports = new ContactService();

})();