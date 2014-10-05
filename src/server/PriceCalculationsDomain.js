(function () {
    var mongoose = require('mongoose');

    var ResourceSchema = new mongoose.Schema({
        name: { type: String, unique: true, required: true },
        group: { type: String },
        unit: { type: String, required: true }
    });

    var Resource = mongoose.model('Resource', ResourceSchema, 'Resources');
    module.exports['Resource'] = Resource;

    var OperationSchema = new mongoose.Schema({
        name: { type: String, unique: true, required: true },
        description: { type: String },
        unit: { type: String, required: true },
        resources: [{
            resource: { type: mongoose.SchemaTypes.ObjectId, ref: 'Resource', required: true },
            quantity: { type: Number, required: true }
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
        variables: [{
            name: { type: String, required: true },
            description: { type: String },
            formula: { type: String, required: true }
        }],
        operations: [{
            operation: { type: mongoose.SchemaTypes.ObjectId, ref: 'Operation', required: true },
            conversion: { type: String },
            note: { type: String },
            count: { type: Number, required: true }
        }]
    });

    var Calculation = mongoose.model('Calculation', CalculationSchema, 'Calculations');
    module.exports['Calculation'] = Calculation;
})();