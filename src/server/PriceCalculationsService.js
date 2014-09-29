(function () {
    function PriceCalculationsService() {
        this.domain = require('./PriceCalculationsDomain.js');
        this.q = require('q');
    }

    PriceCalculationsService.prototype.findCalculations = function () {
        var d = this.q.defer();

        this.domain.Calculation.find({}, d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.getCalculation = function (id) {
        var d = this.q.defer();

        this.domain.Calculation.findById(id, d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.createCalculation = function (calculation) {
        var d = this.q.defer();

        new this.domain.Calculation(calculation).save(d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.updateCalculation = function (id, calculation) {
        var d = this.q.defer();

        this.domain.Calculation.findById(id, function (err, result) {
            if (err) {
                d.reject(err);
                return;
            }

            result.name = calculation.name;
            result.description = calculation.description;
            result.unit = calculation.unit;

            result.parameters = [];
            for (var pindex in calculation.parameters) {
                var param = calculation.parameters[pindex];
                result.parameters.push({ name: param.name, description: param.description });
            }

            result.operations = [];
            for (var oindex in calculation.operations) {
                var oper = calculation.operations[oindex];
                result.operations.push({ count: oper.count, operationId: oper.operationId, note: oper.note, conversion: oper.conversion });
            }

            result.save(d.makeNodeResolver());
        });

        return d.promise;
    }

    PriceCalculationsService.prototype.findOperations = function () {
        var d = this.q.defer();

        this.domain.Operation.find({}, d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.createOperation = function (name, description, unit) {
        var d = this.q.defer();

        new this.domain.Operation({ name: name, description: description, unit: unit }).save(d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.updateOperation = function (id, name, description, unit) {
        var d = this.q.defer();

        this.domain.Operation.findById(id, function (err, operation) {
            if (err) {
                d.reject(err);
                return;
            }

            operation.name = name;
            operation.description = description;
            operation.unit = unit;

            operation.save(d.makeNodeResolver());
        });

        return d.promise;
    }

    PriceCalculationsService.prototype.findResources = function () {
        var d = this.q.defer();

        this.domain.Resource.find({}, d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.createResource = function (name, group, unit) {
        var d = this.q.defer();

        new this.domain.Resource({ name: name, group: group, unit: unit }).save(d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.updateResource = function (id, name, group, unit) {
        var d = this.q.defer();

        this.domain.Resource.findByIdAndUpdate(id, { $set: { name: name, group: group, unit: unit} }, d.makeNodeResolver());

        return d.promise;
    }

    module.exports = new PriceCalculationsService();
})();