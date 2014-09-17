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

    router.route('/financial/accounts')
        .get(handlerFactory(function () {
            return financialService.findAccounts('');
        }))
        .put(function (req, res, next) {
            var promise = financialService.createAccount(req.body.name, req.body.type);
            promise.then(function (account) {
                res.status(200).json(account);
            }, function (err) {
                res.status(500).end(err);
            });
        });

    router.route('/financial/accounts/types')
        .get(function (req, res, next) {
            var promise = accountingService.findAccountTypes();
            promise.then(function (data) {
                res.status(200).json(data);
            }, function (error) {
                res.status(500).end(error);
            });
        });

    router.route('/financial/accounts/:type')
        .get(handlerFactory(function (req) {
            return financialService.findAccounts(req.params.type);
        }));

    router.route('/financial/transactions')
        .put(handlerFactory(function (req) {
            return financialService.saveTransactions(req.body);
        }));

    require('./ContactsApi.js')(router);
    require('./ProjectsApi.js')(router);
    require('./TimeRegistrationApi.js')(router);
    require('./TodosApi.js')(router);

    return router;
}

var handlerFactory = function (serviceCall) {
    return function (req, res, next) {
        var promise = serviceCall(req);
        promise.then(function (result) {
            res.status(200).json(result);
        }, function (error) {
            res.status(500).end(error);
        })
    };
};