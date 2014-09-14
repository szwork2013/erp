(function () {
    function ProjectsService() {
        this.q = require('q');
        this.domain = require('./ProjectsDomain.js');
    }

    ProjectsService.prototype.findProjects = function () {
        var d = this.q.defer();

        this.domain.Project.find({}, function (err, projects) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(projects);
            }
        });

        return d.promise;
    };

    ProjectsService.prototype.createProject = function (name) {
        var d = this.q.defer();

        var project = new this.domain.Project({ name: name });

        project.save(function (err) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(project);
            }
        });

        return d.promise;
    };

    ProjectsService.prototype.getProject = function (id) {
        var d = this.q.defer();

        this.domain.Project.findById(id, function (err, project) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(project);
            }
        });

        return d.promise;
    };

    ProjectsService.prototype.updateProject = function (project) {
        var d = this.q.defer();

        this.domain.Project.findByIdAndUpdate(project._id, { $set: { description: project.description} }, function (err, project) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(project);
            }
        })

        return d.promise;
    };

    module.exports = new ProjectsService();
})();

/*
exports.createWorkItem = function (workitem, cb) {
if (!workitem.projectId || !workitem.name) {
throw new Error('no projectid or name');
}

var wi = {
projectId: workitem.projectId,
name: workitem.name,
description: workitem.description || ''
};

db.saveDocument('WorkItems', wi, function (err, result) {
if (err) {
throw err;
}
else {
cb(result);
}
});
};

exports.findWorkItems = function (projId, cb) {
db.queryByIndex('WorkItemsByProjectId', { projectId: projId }, 0, 128, function (err, result) {
if (err) {
throw err;
}
else {
result = JSON.parse(result.body).Results;
if (result) {
_.each(result, fromDocument);
cb(result);
}
else {
cb([]);
}
}
});
};

exports.getWorkItem = function (projectId, workitemId, cb) {
db.getDocument(workitemId, function (err, result) {
if (err) {
throw err;
}
else {
if (!result) {
throw new Error('entity not found');
}

var workItem = fromDocument(result);
if (workItem.projectId != projectId) {
throw new Error('not a workitem of the specified project');
}

cb(workItem);
}
});
};

exports.findMaterials = function (projectId, workitemId, cb) {

};

exports.saveMaterials = function (projectId, workitemId, materials, cb) {

};
*/