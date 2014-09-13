(function () {
    function Api() {
    }

    Api.prototype.processResponse = function (promise, response) {
        promise.then(function (result) {
            response.status(200).json(result);
        }, function (err) {
            response.status(500).end(err);
        })
    }

    module.exports = new Api();
})();