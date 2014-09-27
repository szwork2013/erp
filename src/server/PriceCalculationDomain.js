(function () {
    var mongoose = require('mongoose');

    var OperationSchema = new mongoose.Schema({
        name: { type: String, unique: true, required: true },
        description: { type: String },
        unit: { type: String, required: true },
        resources: [{
            name: { type: String, unique: true, required: true },
            group: { type: String },
            quantity: { type: Number }
        }]
    });

    var Operation = mongoose.model('Operation', OperationSchema, 'Operations');
    module.exports['Operation'] = Operation;

    var CalculationSchema = new mongoose.Schema({
        name: { type: String, unique: true, required: true },
        description: { type: String },
        unit: { type: String, required: true },
        parameters: [{
            name: { type: String, required: true },
            description: { type: String }
        }],
        operations: [{
            operation: { type: mongoose.SchemaTypes.ObjectId, ref: 'Operation' },
            conversion: { type: String }
        }]
    });

    var Calculation = mongoose.model('Calculation', CalculationSchema, 'Calculations');
    module.exports['Calculation'] = Calculation;
})();