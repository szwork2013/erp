(function () {

    function ContactService() {
        this.q = require('q');
        this.domain = require('./ContactsDomain.js');
        this.service = require('./Service.js');
    }

    ContactService.prototype.findContacts = function (type) {
        var query = {};
        if (type) {
            query['type.' + type] = true;
        }

        var d = this.q.defer();

        var c = this.service.createDbCallback(d);
        this.domain.Contact.find(query, c);

        return d.promise;
    };

    ContactService.prototype.createContact = function (name, type) {
        var d = this.q.defer();

        var contact = new this.domain.Contact({ name: name, type: type });
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

    ContactService.prototype.getContact = function (id) {
        var d = this.q.defer();

        var c = this.service.createDbCallback(d);
        this.domain.Contact.findById(id, c);

        return d.promise;
    }

    module.exports = new ContactService();

})();