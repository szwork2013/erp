var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var financialService = require('./financialService.js');
var accountingService = require('./financial/accountingService.js');

module.exports = function () {
    // very important
    var settings = require('./settings.json');
    mongoose.connect(settings.mongodb.connectionstring);

    var router = express.Router();

    router.use(function (req, res, next) {
        res.set('Content-Type', 'application/json');
        next();
    });

    router.use(bodyParser.json());

    require('./ContactsApi.js')(router);
    require('./ProjectsApi.js')(router);
    require('./TimeRegistrationApi.js')(router);
    require('./TodosApi.js')(router);
    require('./AccountingApi.js')(router);

    return router;
}