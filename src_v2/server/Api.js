(function () {
    function Api() {
    }

    Api.prototype.processResponse = function (promise, response) {
        promise.done(function (result) {
            response.status(200).json(result);
        }, function (err) {
            console.log(err);
            response.status(500).end(err.toString());
        });
    };

    module.exports = new Api();
})();