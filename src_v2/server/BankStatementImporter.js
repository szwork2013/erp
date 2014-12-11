(function () {
    function BankStatementImporter() {
    }

    BankStatementImporter.prototype.import = function (name, path) {
        var csv = require('ya-csv');
        var reader = csv.createCsvFileReader(path, {
            columnsFromHeader: true,
            separator: ';',
            quote: '"'
        });

        var records = [];
        reader.on('data', function (data) {
            records.push(data);
        });

        reader.on('end', function () {
            var MongoClient = require('mongodb').MongoClient;
            MongoClient.connect(require('./settings.json').mongodb.connectionstring, function (err, db) {
                var collection = db.collection('bankstatements');
                collection.insert(records, function () {
                    db.close();
                });
            });
        });
    }

    module.exports = new BankStatementImporter();
})();


/*
{ Rekeningnummer: 'BE44737034144245',
  Rubrieknaam: '',
  Naam: 'SCHRIJNWERKERIJ DE RUDDER BVBA',
  Munt: 'EUR',
  Afschriftnummer: '2014012',
  Datum: '04/11/2014',
  Omschrijving: 'EUROPESE DOMICILIERING B2B SCHULDEISER     : DELEK BELGIUM SPRL/BVBA REF. SCHULDEISER: 1401091232 MANDAATREFERTE  : DELEKBE003277136KBC EIGEN OMSCHR.   : DELEK MEDEDELING      : /INV/DDD0003277136 30.10.2014',
  Valuta: '04/11/2014',
  Bedrag: '-71,12',
  Saldo: '-59693,98',
  '': '' }
*/