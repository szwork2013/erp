var csv = require('ya-csv');
var mongoose = require('mongoose');
var domain = require('./ExpenseDomain.js');

mongoose.connect('mongodb://localhost:27017/import');

var inputFile = "onkosten_2014Q3.csv";
var reader = csv.createCsvFileReader(inputFile, { separator: ';', quote: '"', 'escape': '"', columnsFromHeader: true });

reader.on('error', function (err) {
    console.error(err);
});

reader.on('data', function (record) {
    // nummer;leverancier;datum;vervaldatum;document;mededeling;netto;btw;totaal

    var expense = new domain.Expense({
        number: parseInt(record.nummer),
        supplier: record.leverancier,
        date: parseDate(record.datum),
        expirationDate: parseDate(record.vervaldatum),
        documentNumber: record.document,
        paymentMessage: record.mededeling,
        netAmount: parseFloat(record.netto.replace(',', '.')),
        vatAmount: parseFloat(record.btw.replace(',', '.')),
        totalAmount: parseFloat(record.totaal.replace(',', '.'))
    });

    expense.save(function (err) {
        if (err) {
            console.error(err);
        }
    });
});

reader.on('end', function (file) {
    console.log('done processing: ' + file);
});

function parseDate(str) {
    var split = str.split('/');
    return new Date(split[2], split[1] - 1, split[0], 0, 0, 0);
}