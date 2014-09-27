(function () {
    function PricesService() {
        this.domain = require('./PricesDomain.js');
        this.q = require('q');
    }

    PricesService.prototype.findPrices = function () {
        var d = this.q.defer();

        this.domain.Price.find({}, d.makeNodeResolver());

        return d.promise;
    }

    PricesService.prototype.createPrice = function (name, unit, price) {
        var d = this.q.defer();

        new this.domain.Price({ name: name, unit: unit, price: price }).save(d.makeNodeResolver());

        return d.promise;
    }

    PricesService.prototype.updatePrice = function (id, name, unit, price) {
        var d = this.q.defer();

        this.domain.Price.findByIdAndUpdate(id, { $set: { name: name, unit: unit, price: price} }, d.makeNodeResolver());

        return d.promise;
    }

    module.exports = new PricesService();
})();