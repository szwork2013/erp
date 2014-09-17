(function () {
    var domain = require('./domain.js');
    for (i in domain) {
        module.exports[i] = domain[i];
    }

    var mongoose = require('mongoose');

    var todoSchema = new mongoose.Schema({
        title: String,
        description: String,
        status: String
    });

    var todo = mongoose.model('Todo', todoSchema, 'Todos');
    module.exports['Todo'] = todo;
})();