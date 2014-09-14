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

    ProjectsService.prototype.findWorkItems = function (projectId) {
        var d = this.q.defer();

        this.domain.WorkItem.find({ projectId: this.domain.createObjectId(projectId) }, function (err, workitems) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(workitems);
            }
        });

        return d.promise;
    };

    ProjectsService.prototype.createWorkItem = function (projectId, name, description) {
        var d = this.q.defer();

        var wi = new this.domain.WorkItem({ projectId: this.domain.createObjectId(projectId), name: name, description: description });
        wi.save(function (err) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(wi);
            }
        })

        return d.promise;
    };

    ProjectsService.prototype.getWorkItem = function (projectId, workItemId) {
        var d = this.q.defer();

        this.domain.WorkItem.findOne({ projectId: this.domain.createObjectId(projectId), '_id': this.domain.createObjectId(workItemId) }, function (err, workitem) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(workitem);
            }
        })

        return d.promise;
    };

    module.exports = new ProjectsService();
})();