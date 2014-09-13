(function () {
    function AccountingService(q, db) {
        this.q = q;
        this.db = db;
    }

    AccountingService.prototype.findAccountTypes = function () {
        var d = this.q.defer();

        this.db.accountTypes.find({}, function (err, docs) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(docs);
            }
        });

        return d.promise;
    };

    AccountingService.prototype.findAccounts = function (type) {
        var d = this.q.defer();

        return d.promise();
    };

    AccountingService.prototype.createAccount = function (name, type) {
        var d = q.defer();

        return d.promise;
    };

    AccountingService.prototype.createBookings = function (bookings) {
        var d = q.defer();

        return d.promise;
    };

    // dependencies
    var q = require('q');
    var settings = require('../settings.json');
    var db = {};
    
    module.exports = new AccountingService(q, db);
})();