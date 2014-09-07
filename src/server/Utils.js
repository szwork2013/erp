exports.createDbCallback = function (defer) {
    return function (err, result) {
        if (err) {
            defer.reject(err);
        }
        else {
            defer.resolve(result);
        }
    }
}