(function () {
    function AccountService(q, db) {
        this.q = q;
        this.db = db;
    }

    AccountService.prototype.findAccountTypes = function () {
        var d = this.q.defer();

        return q.promise();
    };

    AccountService.prototype.findAccounts = function (type) {
        var d = this.q.defer();

        return q.promise();
    };

    AccountService.prototype.createAccount = function (name, type) {
        var d = q.defer();

        return d.promise;
    };

    AccountService.prototype.createBookings = function (bookings) {
        var d = q.defer();

        return d.promise;
    };

    // dependencies
    var q = require('q');
    var settings = require('../settings.json');
    var ravendb = require('ravendb');
    var db = ravendb(settings.db.host, settings.db.name);

    module.exports = new AccountService(q, db);
})();