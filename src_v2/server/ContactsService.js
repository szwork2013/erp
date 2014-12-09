(function () {
    var q = require('q');
    var domain = require('./ContactsDomain.js');
    var eventDispatcher = require('./EventDispatcher.js');

    function ContactsService() {

    }

    ContactsService.prototype.findContacts = function () {
        var d = q.defer();

        domain.Contact.find({}, d.makeNodeResolver());

        return d.promise;
    }

    ContactsService.prototype.createContact = function (contact) {
        var d = q.defer();
        var co = new domain.Contact(contact);
        co.save(function (err, con) {
            if (err) {
                d.reject(err);
                return;
            }

            d.resolve(con);
            eventDispatcher.send('contact_created', con);
        });

        return d.promise;
    }

    ContactsService.prototype.updateContact = function (id, contact) {
        var d = q.defer();
        domain.Contact.findById(id, function (err, co) {
            if (err) {
                d.reject(err);
                return;
            }

            co.name = contact.name;
            co.type = contact.type;
            co.save(function (e, con) {
                if (e) {
                    d.reject(e);
                    return;
                }

                d.resolve(e);
                eventDispatcher.send('contact_updated', con);
            });
        });

        return d.promise;
    }

    module.exports = new ContactsService();
})();