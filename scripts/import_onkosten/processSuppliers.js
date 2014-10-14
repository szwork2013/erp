var mongoose = require('mongoose');
var domain = require('./ExpenseDomain.js');

mongoose.connect('mongodb://localhost:27017/import');

domain.Expense.find({}).distinct('supplier', function (err, suppliers) {
    for (var s in suppliers) {
        console.log(suppliers[s]);
    }
});