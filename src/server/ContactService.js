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

        this.db.contactTypes.find({}, function (err, docs) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(docs);
            }
        })

        return d.promise;
    }

    ContactService.prototype.createType = function (name) {
        var d = this.q.defer();

        this.db.contactTypes.insert({ name: name }, function (err, doc) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(doc);
            }
        });

        return d.promise;
    }

    var q = require('q');
    var nedb = require('nedb');

    var db = {};
    db.contactTypes = new nedb({ filename: './data/contactTypes.db', autoload: true });
    db.contacts = new nedb({ filename: './data/contacts.db', autoload: true });

    module.exports = new ContactService(q, db);

})();