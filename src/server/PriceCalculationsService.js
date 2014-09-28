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

    PriceCalculationsService.prototype.createCalculation = function (calculation) {
        var d = this.q.defer();

        new this.domain.Calculation(calculation).save(d.makeNodeResolver());

        return d.promise;
    }

    module.exports = new PriceCalculationsService();
})();