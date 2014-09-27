(function () {
    var mongoose = require('mongoose');

    var PriceSchema = new mongoose.Schema({
        name: { type: String, unique: true, required: true },
        unit: { type: String },
        price: { type: Number, 'default': 0.0 }
    });

    var Price = mongoose.model('Price', PriceSchema, 'Prices');
    module.exports['Price'] = Price;
})();