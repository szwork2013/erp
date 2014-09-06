(function () {
    var nedb = require('nedb');
    var settings = require('./settings.json');

    module.exports = {};

    module.exports.purchasesDb = function () {
        return new nedb({filename: settings.db.files.purchases, autoload: true});
    };
})();