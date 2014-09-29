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

        try {
            new this.domain.Calculation(calculation).save(d.makeNodeResolver());
        }
        catch (err) {
            d.reject(err);
        }

        return d.promise;
    }

    PriceCalculationsService.prototype.findOperations = function () {
        var d = this.q.defer();

        this.domain.Operation.find({}, d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.findResources = function () {
        var d = this.q.defer();

        this.domain.Resource.find({}, d.makeNodeResolver());

        return d.promise;
    }

    PriceCalculationsService.prototype.createResource = function (name, group, unit) {
        var d = this.q.defer();

        try {
            new this.domain.Resource({ name: name, group: group, unit: unit }).save(d.makeNodeResolver());
        }
        catch (err) {
            d.reject(err);
        }

        return d.promise;
    }

    PriceCalculationsService.prototype.updateResource = function (id, name, group, unit) {
        var d = this.q.defer();

        this.domain.Resource.findByIdAndUpdate(id, { $set: { name: name, group: group, unit: unit} }, d.makeNodeResolver());

        return d.promise;
    }

    module.exports = new PriceCalculationsService();
})();