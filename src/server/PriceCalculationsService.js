(function () {
    function PriceCalculationsService() {
        this.domain = require('./PriceCalculationsDomain.js');
        this.q = require('q');
    }

    PriceCalculationsService.prototype.findOperations = function () {
        var d = this.q.defer();

        this.domain.Operation.find({}, d.makeNodeResolver());

        return d.promise;
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

    module.exports = new PriceCalculationsService();
})();