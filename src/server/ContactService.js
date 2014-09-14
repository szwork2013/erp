(function () {

    function ContactService() {
        this.q = require('q');
        this.domain = require('./ContactsDomain.js');
    }

    ContactService.prototype.findTypes = function () {
        var d = this.q.defer();

        this.domain.ContactType.find({}, function (err, types) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(types)
            }
        });

        return d.promise;
    }

    ContactService.prototype.find = function (type) {
        var query = {};
        if (type) {
            query.type = type;
        }

        var d = this.q.defer();

        this.db.contacts.find(query, function (err, docs) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(docs);
            }
        });

        return d.promise;
    };

    module.exports = new ContactService();

})();