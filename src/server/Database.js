(function () {
    var mongodb = require('mongodb');
    var settings = require('./settings.json');
    var q = require('q');

    function Database() {
        this.mongo = require('mongodb');
    }

    Database.prototype.createByIdQuery = function (id) {
        var o_id = mongodb.ObjectID(id);
        return { '_id': o_id };
    }

    Database.prototype.getCollection = function (name) {
        var d = q.defer();

        mongodb.Db.connect(settings.mongodb.connectionstring, function (err, db) {
            if (err) {
                d.reject(err);
            }
            else {
                db.collection(name, function (err, collection) {
                    if (err) {
                        d.reject(err);
                    }
                    else {
                        d.resolve(collection);
                    }
                });
            }
        });

        return d.promise;
    };

    Database.prototype.closeCollection = function (collection) {
        collection.db.close(function (err) {
            console.log(err);
        });
    }

    module.exports = new Database();
})();