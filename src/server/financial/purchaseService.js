(function () {

    function PurchaseService(q, db) {
        this.q = q;
        this.db = db;
    };

    PurchaseService.prototype.findPurchases = function (page, pageSize) {
        if (!page) {
            page = 0;
        }

        if (!pageSize) {
            pageSize = 25;
        }

        var deferred = q.defer();

        dbs.find({}).skip(page * pageSize).limit(pageSize).exec(function (err, docs) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(docs);
            }
        });

        return deferred.promise;
    };

    var dbs = require('../db.js');
    var q = require('q');
    module.exports = new PurchaseService(q, dbs.purchasesDb());
})();