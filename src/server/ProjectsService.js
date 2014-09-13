(function () {
    function ProjectsService() {
        this.q = require('q');
        this.db = require('./Database.js');
    }

    ProjectsService.prototype.findProjects = function () {
        var d = this.q.defer();

        this.db.getCollection('Projects')
            .then(function (collection) {
                collection.find({}).toArray(function (err, docs) {
                    if (err) {
                        d.reject(err);
                    }
                    else {
                        d.resolve(docs);
                    }
                })
            }, function (err) {
                d.reject(err);
            })

        return d.promise;
    };

    ProjectsService.prototype.createProject = function (name) {
        var project = {};
        project.name = name;

        var d = this.q.defer();

        this.db.getCollection('Projects')
            .then(function (collection) {
                collection.insert(project, {}, function (err, result) {
                    if (err) {
                        d.reject(err);
                    }
                    else {
                        d.resolve(result);
                    }
                });
            }, function (err) {
                d.reject(err);
            });

        return d.promise;
    };

    ProjectsService.prototype.getProject = function (id) {
        var d = this.q.defer();
        var me = this;

        this.db.getCollection('Projects')
            .then(function (collection) {
                var query = me.db.createByIdQuery(id);
                collection.findOne(query, function (err, result) {
                    if (err) {
                        d.reject(err);
                    }
                    else {
                        console.log(result);
                        d.resolve(result);
                    }
                });
            }, function (err) {
                d.reject(err);
            });

        return d.promise;
    };

    module.exports = new ProjectsService();
})();

/*
exports.createProject = function (name, cb) {
var project = {};
project.name = name;

db2.projects.insert(project);
};

exports.findProjects = function (page, cb) {
var pageSize = 25;

db2.projects.find({}, function (err, docs) {
if (err) {
throw err;
}
else {
_.each(docs, projectId);
cb(docs);
}
});
};

exports.getProject = function (id, cb) {
console.log('getProject: id= ' + id);
db2.projects.findOne({ _id: id }, function (err, doc) {
if (err) {
throw err;
}
else {
console.log('getProject: doc= ' + projectId(doc));
cb(projectId(doc));
}
});
};

exports.saveProject = function (project, cb) {
var proj = {};
proj.id = project.id;
proj.name = project.name;
proj.description = project.description || '';

db.saveDocument('Projects', proj, function (err, result) {
if (err) {
throw err;
}
else {
cb(result);
}
});
};

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