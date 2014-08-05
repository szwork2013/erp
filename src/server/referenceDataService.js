var referenceData = require('./referenceData.json');

exports.findUnits = function (cb) {
    cb(referenceData.units);
}