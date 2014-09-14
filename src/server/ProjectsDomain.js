(function () {
    var domain = require('./Domain.js');
    for (i in domain) {
        module.exports[i] = domain[i];
    }

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var projectSchema = new Schema({
        name: String,
        description: String
    });

    var Project = mongoose.model('Project', projectSchema, 'Projects');

    module.exports['Project'] = Project;

    var workItemSchema = new Schema({
        projectId: Schema.Types.ObjectId,
        name: String,
        description: String
    });

    var WorkItem = mongoose.model('WorkItem', workItemSchema, 'WorkItems');

    module.exports['WorkItem'] = WorkItem;
})();