(function () {
    function AccountingService(q, db) {
        this.q = q;
        this.db = db;
    }

    AccountingService.prototype.findAccountTypes = function () {
        var d = this.q.defer();

        return q.promise();
    };

    AccountingService.prototype.findAccounts = function (type) {
        var d = this.q.defer();

        return q.promise();
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
    var datastore = require('nedb');
    var db = new datastore({ filename: 'accounting', autload: true });

    module.exports = new AccountingService(q, db);
})();