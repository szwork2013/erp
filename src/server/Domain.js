(function () {
    var mongoose = require('mongoose');

    module.exports['createObjectId'] = function (str) {
        return mongoose.Types.ObjectId(str);
    }
})();