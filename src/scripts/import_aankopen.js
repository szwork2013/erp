var mongoose = require('mongoose');
var settings = require('../server/settings.json');

mongoose.connect(settings.mongodb.connectionstring);

var q = require('q');

function findContacts() {
    var d = q.defer();

    var c = require('../server/ContactsDomain.js');
    c.Contact.find({}, function (err, results) {
        if (err) {
            console.error(err);
            d.reject(err);
        }
        else {
            var contactsLookup = {};
            for (i in results) {
                var r = results[i];

                contactsLookup[r.name] = r._id;
            }

            d.resolve(contactsLookup);
        }
    });

    return d.promise;
}

function importExpenses(contactsLookup) {
    function parseDate(str) {
        var parts = str.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    var csv = require('ya-csv');
    var a = require('../server/AccountingDomain.js');

    var inputFileName = "D:\\_zaak\\dries\\erp\\src\\scripts\\aankopen.csv";
    var reader = csv.createCsvFileReader(inputFileName, { separator: ';', quote: '"', 'escape': '"', columnsFromHeader: true });
    reader.addListener('data', function (record) {
        record.sequence = parseInt(record.sequence);
        record.date = parseDate(record.date);
        record.expirationDate = parseDate(record.expirationDate);
        record.supplierId = contactsLookup[record.supplier];
        record.netAmount = parseFloat(record.netAmount.replace(',', '.'));
        record.vatAmount = parseFloat(record.vatAmount.replace(',', '.'));
        record.totalAmount = parseFloat(record.totalAmount.replace(',', '.'));
        record.outstandingAmount = parseFloat(record.outstandingAmount.replace(',', '.'));

        var expense = new a.Expense(record);
        expense.save(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });

    reader.on('error', function (err) {
        console.error(err);
    });
}

findContacts().done(importExpenses);