(function () {
    function TodosService() {
        this.q = require('q');
        this.domain = require('./TodosDomain.js');
        this.service = require('./Service.js');
    }

    TodosService.prototype.find = function (status) {
        var d = this.q.defer();

        var c = this.service.createDbCallback(d);
        var query = {};
        if (status) {
            query['status'] = status;
        }

        this.domain.Todo.find(query, c);

        return d.promise;
    }

    TodosService.prototype.create = function (title, description) {
        var d = this.q.defer();

        var todo = new this.domain.Todo({ title: title, description: description, status: 'not done' });
        todo.save(function (err) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(todo);
            }
        })

        return d.promise;
    }

    TodosService.prototype.updateStatus = function (id, status) {
        var d = this.q.defer();

        var c = this.service.createDbCallback(d);
        this.domain.Todo.findByIdAndUpdate(id, { $set: { status: status} }, c);

        return d.promise;
    }

    module.exports = new TodosService();
})();