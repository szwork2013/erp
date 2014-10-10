var fs = require('fs');
var path = require('path');
var csv = require('ya-csv');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

var inputDir = "D:\\_zaak\\dries\\erp\\src\\scripts\\import_bank\\kbc_csv\\in";
var outputDir = "D:\\_zaak\\dries\\erp\\src\\scripts\\import_bank\\kbc_csv\\out";

console.log('Start scanning directory');

fs.readdir(inputDir, function (err, files) {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach(function (file) {
        processFile(path.join(inputDir, file));
    });
});

var regex = [
    {
        regex: new RegExp(/^EUROPESE OVERSCHRIJVING NAAR (.*) BANKIER BEGUNSTIGDE: ([a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?) (.*)/),
        parse: function (match) {
            return {
                creditorAccountNumber: match[1].replace(' ' , ''),
                message: match[4]
            };
        }
    },
    {
        regex: new RegExp(/^EUROPESE OVERSCHRIJVING VAN (.*) BANKIER OPDRACHTGEVER: ([a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?) (.*)/),
        parse: function (match) {
            return {
                debtorAccountNumber: match[1].replace(' ' , ''),
                message: match[4]
            };
        }
    }
];

function processFile(file) {

    var reader = csv.createCsvFileReader(file, { separator: ';', quote: '"', 'escape': '"', columnsFromHeader: true });

    reader.on('error', function (err) {
        console.error('file: ' + file + ' ' + JSON.stringify(err));
    });

    reader.on('data', function (record) {
        // Rekeningnummer;Rubrieknaam;Naam;Munt;Afschriftnummer;Datum;Omschrijving;Valuta;Bedrag;Saldo;

        var trans = new Transaction({
            accountNumber: record.Rekeningnummer,
            accountName: record.Naam,
            currency: record.Munt,
            date: parseDate(record.Datum),
            valueDate: parseDate(record.Valuta),
            message: record.Omschrijving,
            amount: parseFloat(record.Bedrag.replace(',', '.')),
            balance: parseFloat(record.Saldo.replace(',', '.'))
        });

        for (var i = 0; i < regex.length; i++) {
            var r = regex[i];
            var match = record.Omschrijving.match(r.regex);
            if (match) {
                trans.info = r.parse(match);
                break;
            }
        }

        trans.save(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });

    reader.on('end', function (file) {
        console.log('done processing: ' + file);
    });
}

function parseDate(str) {
    var split = str.split('/');
    return new Date(split[2], split[1] - 1, split[0], 0, 0, 0);
}

var TransactionSchema = new mongoose.Schema({
    accountNumber: { type: String, required: true },
    accountName: { type: String },
    currency: { type: String, required: true, 'default': 'EUR' },
    date: { type: Date, required: true },
    valueDate: { type: Date },
    message: { type: String },
    amount: { type: Number, required: true, 'default': 0.0 },
    balance: { type: Number },
    info: { type: mongoose.SchemaTypes.Mixed }
});

var Transaction = mongoose.model('Transaction', TransactionSchema, 'Transactions');