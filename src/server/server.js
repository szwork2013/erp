var express = require('express');
var bodyParser = require('body-parser');

var projectService = require('./projectService');
var referenceDataService = require('./referenceDataService.js');
var financialService = require('./financialService.js');

module.exports = function () {
    var router = express.Router();

    router.use(function (req, res, next) {
        res.set('Content-Type', 'application/json');
        next();
    });

    router.use(bodyParser.json());

    router.route('/projects')
		.get(function (req, res, next) {
		    try {
		        var page = req.param('page') || 0;
		        projectService.findProjects(page, function (result) {
		            res.status(200).json(result);
		        });
		    }
		    catch (e) {
		        console.log(e);
		        res.status(500).end();
		    }
		})
		.put(function (req, res, next) {
		    try {
		        if (!req.body || !req.body.name) {
		            throw new Error("Name not specified");
		        }

		        projectService.createProject(req.body.name, function (result) {
		            res.status(200).json({ id: result.id });
		        });
		    }
		    catch (e) {
		        console.log(e);
		        res.status(500).end();
		    }
		})
		.post(function (req, res, next) {
		    try {
		        projectService.saveProject(req.body, function (result) {
		            res.status(200).end();
		        });
		    }
		    catch (e) {
		        console.log(e);
		        res.status(500).end();
		    }
		});

    router.route('/projects/:projectid')
		.get(function (req, res, next) {
		    try {
		        projectService.getProject(req.params.projectid, function (result) {
		            res.status(200).json(result);
		        });
		    }
		    catch (e) {
		        console.log(e);
		        res.status(500).end();
		    }
		});

    router.route('/projects/workitems')
		.put(function (req, res, next) {
		    try {
		        projectService.createWorkItem(req.body, function (result) {
		            res.status(200).end();
		        });
		    }
		    catch (e) {
		        console.log(e);
		        res.status(500).end();
		    }
		});

    router.route('/projects/:projectid/workitems')
		.get(function (req, res, next) {
		    try {
		        projectService.findWorkItems(req.params.projectid, function (result) {
		            res.status(200).json(result);
		        });
		    }
		    catch (e) {
		        console.log(e);
		        res.status(500).end();
		    }
		});

    router.route('/projects/:projectId/workitems/:workItemId')
		.get(function (req, res, next) {
		    try {
		        projectService.getWorkItem(req.params.projectId, req.params.workItemId, function (result) {
		            res.status(200).json(result);
		        });
		    }
		    catch (e) {
		        console.log(e);
		        res.status(500).end();
		    }
		});

    router.route('/referenceData/units')
        .get(function (req, res, next) {
            referenceDataService.findUnits(function (units) {
                res.status(200).json(units);
            });
        });

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
            res.status(200).json(financialService.findAccountTypes());
        });

    router.route('/financial/accounts/:type')
        .get(handlerFactory(function (req) {
            return financialService.findAccounts(req.params.type);
        }));

    router.route('/financial/transactions')
        .put(handlerFactory(function (req) {
            return financialService.saveTransactions(req.body);
        }));


    require('./ContactApi.js')(router);
    require('./TimeRegistrationApi.js')(router);

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