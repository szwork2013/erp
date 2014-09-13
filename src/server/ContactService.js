(function () {

    function ContactService(q, db) {
        this.q = q;
        this.db = db;
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

    ContactService.prototype.findTypes = function () {
        var d = this.q.defer();

        this.db.getCollection('ContactTypes')
            .then(function (collection) {
                collection.find({}).toArray(function (err, docs) {
                    if (err) {
                        d.reject(err);
                    }
                    else {
                        d.resolve(docs);
                    }
                });

                this.db.closeCollection(collection);
            }, function (err) {
                d.reject(err);
            });

        return d.promise;
    }

    var q = require('q');
    var db = require('./Database.js');

    module.exports = new ContactService(q, db);

})();