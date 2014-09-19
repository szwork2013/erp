(function () {

    var mongoose = require('mongoose');
    var q = require('q');

    var sequenceSchema = new mongoose.Schema({
        _id: String,
        value: Number
    });

    sequenceSchema.statics.nextSequence = function (name) {
        var d = q.defer();

        this.findByIdAndUpdate(name, { $inc: { value: 1} }, { 'new': true, upsert: true }, function (err, result) {
            if (err) {
                d.reject(err);
            }
            else {
                d.resolve(result.value);
            }
        });

        return d.promise;
    };

    var Sequence = mongoose.model('Sequence', sequenceSchema, 'Sequences');

    module.exports['Sequence'] = Sequence;
})();