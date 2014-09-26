var csv = require('ya-csv');
var mongoose = require('mongoose');
var settings = require('../server/settings.json');

mongoose.connect(settings.mongodb.connectionstring);

var domain = require('../server/ContactsDomain.js');

var inputFileName = "D:\\_zaak\\dries\\erp\\src\\scripts\\leveranciers.csv";
var reader = csv.createCsvFileReader(inputFileName, { separator: ';', quote: '"', 'escape': '"', columnsFromHeader: true });
reader.addListener('data', function (record) {
    record._id = new mongoose.Types.ObjectId();
    record.type = { leverancier: true, klant: false, personeel: false };

    var contact = new domain.Contact(record);
    contact.save(function (err) {
        if (err) {
            console.error(err);
        }
    });
});

reader.on('error', function (err) {
    console.error(err);
});