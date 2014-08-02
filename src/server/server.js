var express = require('express');
var bodyParser = require('body-parser');

var projectService = require('./projectService');

module.exports = function() {
	var router = express.Router();
	
	router.use(function(req, res, next) {
		res.set('Content-Type', 'application/json');
		next();
	});
	
	router.use(bodyParser.json());
	
	router.route('/projects')
		.get(function(req, res, next) {
			try {
				var page = req.param('page') || 0;
				projectService.findProjects(page, function(result) {
					res.status(200).json(result);
				});
			}
			catch (e) {
				console.log(e);
				res.status(500).end();
			}
		})
		.put(function(req, res, next) {
			try {
				if (!req.body || !req.body.name) {
					throw new Error("Name not specified");
				}
			
				projectService.createProject(req.body.name, function(result) {
					res.status(200).json({id: result.id});
				});
			}
			catch (e) {
				console.log(e);
				res.status(500).end();
			}
		})
		.post(function(req, res, next) {
			try {
				projectService.saveProject(req.body, function(result) {
					res.status(200).end();
				});
			}
			catch (e) {
				console.log(e);
				res.status(500).end();
			}
		});
		
	router.route('/projects/:projectid')
		.get(function(req, res, next) {
			try {
				projectService.getProject(req.params.projectid, function(result) {
					res.status(200).json(result);
				});
			}
			catch (e) {
				console.log(e);
				res.status(500).end();
			}
		});
	
	router.route('/projects/workitems')
		.put(function(req, res, next) {
			try {
				projectService.createWorkItem(req.body, function(result) {
					res.status(200).end();
				});
			}
			catch (e) {
				console.log(e);
				res.status(500).end();
			}
		});
		
	router.route('/projects/:projectid/workitems')
		.get(function(req, res, next) {
			try {
				projectService.findWorkItems(req.params.projectid, function(result) {
					res.status(200).json(result);
				});
			}
			catch (e) {
				console.log(e);
				res.status(500).end();
			}
		});
	
	router.route('/projects/:projectId/workitems/:workItemId')
		.get(function(req, res, next) {
			try {
				projectService.getWorkItem(req.params.projectId, req.params.workItemId, function(result) {
					res.status(200).json(result);
				});
			}
			catch(e) {
				console.log(e);
				res.status(500).end();
			}
		});
	
	return router;
}