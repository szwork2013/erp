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

    module.exports = new TodosService();
})();