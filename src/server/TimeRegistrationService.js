(function () {
    function TimeRegistrationService(q, db, utils) {
        this.q = q;
        this.db = db;
        this.utils = utils;
    }

    TimeRegistrationService.prototype.find = function () {
        var query = {};

        var d = this.q.defer();
        this.db.timeRegistration.find(query, this.utils.createDbCallback(d));
        return d.promise;
    }

    TimeRegistrationService.prototype.create = function (employee, project, date, description, hours) {
        var tr = {};
        tr.employee = employee;
        tr.project = project;
        tr.date = date;
        tr.description = description;
        tr.hours = hours;

        var d = this.q.defer();
        this.db.timeRegistration.insert(tr, this.utils.createDbCallback(d));
        return d.promise;
    }

    var _q = require('q');
    var _db = {};

    var _utils = require('./utils.js');

    module.exports = new TimeRegistrationService(_q, _db, _utils);
})();