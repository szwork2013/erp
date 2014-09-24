(function () {
    var mongoose = require('mongoose');
    module.exports['createObjectId'] = function (str) {
        return mongoose.Types.ObjectId(str);
    }

    var sequence = require('./Sequence.js');
    module.exports['nextValue'] = function (name) {
        return sequence.Sequence.nextValue(name);
    }
})();