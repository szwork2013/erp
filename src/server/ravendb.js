(function () {
    function RavenDb(host, database) {
        this._host = host;
        this._database = database;
    }

    RavenDb.prototype.findDocuments = function (collection, start, pageSize, query) {

    };

    module.exports = function (host, database) {
        return new RavenDb(host, database);
    };
})();