(function () {

    function Service() {
    }

    Service.prototype.createDbCallback = function (defer) {
        return function (err, result) {
            if (err) {
                defer.reject(err);
            }
            else {
                defer.resolve(result);
            }
        };
    };

    module.exports = new Service();
})();