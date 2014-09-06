(function () {
    function TimeRegistrationService(q, db) {
        this.q = q;
        this.db = db;
    }

    TimeRegistrationService.prototype.create()

    var q = require('q');
    var nedb = require('nedb');
    var db = {};
    db.timeRegistration = new nedb({ filename: './data/timeRegistration.db', autoload: true });

    module.exports = new TimeRegistrationService(q, db);
})();