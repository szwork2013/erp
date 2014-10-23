var app = require('./App.js');
var domain = require('../AccountingDomain.js');

var program = require('commander');
var csv = require('ya-csv');
var q = require('q');

program
    .command('import_bank_transactions')
    .description('Import Bank Transactions')
    .action(importBankTransactions);

program
    .command('import_expenses')
    .description('Import expenses')
    .action(importExpenses);

program.parse(process.argv);


function importBankTransactions(file) {
    var regex = [
        {
            regex: new RegExp(/^EUROPESE OVERSCHRIJVING NAAR (.*) BANKIER BEGUNSTIGDE: ([a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?) (.*) DOORGEGEVEN OP [0-9\-]{8,10} MET KBC-ONLINE FOR BUSINESS \/ ISABEL/),
            parse: function (match) {
                return {
                    type: 'credit-transfer',
                    creditorAccountNumber: match[1].replace(' ', ''),
                    message: match[4]
                };
            }
        },
        {
            regex: new RegExp(/^EUROPESE OVERSCHRIJVING VAN (.*) BANKIER OPDRACHTGEVER: ([a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?) (.*)/),
            parse: function (match) {
                return {
                    type: 'credit-transfer',
                    debtorAccountNumber: match[1],
                    message: match[4]
                };
            }
        },
        {
            regex: new RegExp(/^EUROPESE DOMICILIERING( B2B)? SCHULDEISER(\s*): (.*) REF\. SCHULDEISER: (.*) MANDAATREFERTE(\s*): (.*) EIGEN OMSCHR\.(\s*): (.*) MEDEDELING[\s]{0,}: (.*)/),
            parse: function (match) {
                return {
                    type: 'direct-debit',
                    creditor: match[3],
                    creditorReference: match[4],
                    creditorMandateReference: match[6],
                    creditorDescription: match[8],
                    message: match[9]
                };
            }
        }
    ];

    console.log('Start importing bank transactions from ' + file);

    var reader = csv.createCsvFileReader(file, { separator: ';', quote: '"', 'escape': '"', columnsFromHeader: true });

    reader.on('error', function (err) {
        console.error('file: ' + file + ' ' + JSON.stringify(err));
    });

    reader.on('data', function (record) {
        // Rekeningnummer;Rubrieknaam;Naam;Munt;Afschriftnummer;Datum;Omschrijving;Valuta;Bedrag;Saldo;

        var trans = new domain.BankTransaction({
            bankAccountId: '541f31b42979c6130409d72a',
            date: parseDate(record.Datum),
            valueDate: parseDate(record.Valuta),
            message: record.Omschrijving,
            amount: parseFloat(record.Bedrag.replace(',', '.'))
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

    reader.on('end', function () {
        console.log('done processing: ' + file);
    });
};

function importExpenses(file) {
    console.log('Start importing expenses from file ' + file);

    var reader = csv.createCsvFileReader(file, { separator: ';', quote: '"', 'escape': '"', columnsFromHeader: true });

    reader.on('error', function (err) {
        console.error(err);
    });

    reader.on('end', function () {
        console.log('done processing: ' + file);
    });

    reader.on('data', function (record) {
        // nummer;leverancier;datum;vervaldatum;document;mededeling;netto;btw;totaal

        var expense = new domain.Expense({
            sequence: parseInt(record.nummer),
            supplier: record.lev_id,
            date: parseDate(record.datum),
            expirationDate: parseDate(record.vervaldatum),
            documentNumber: record.document,
            paymentMessage: record.mededeling,
            netAmount: parseFloat(record.netto.replace(',', '.')),
            vatAmount: parseFloat(record.btw.replace(',', '.')),
            totalAmount: parseFloat(record.totaal.replace(',', '.')),
            outstandingBalance: parseFloat(record.totaal.replace(',', '.'))
        });

        expense.save(function (err) {
            if (err) {
                console.error(err);
            }
        });

    });
};

function parseDate(str) {
    var split = str.split('/');
    return new Date(split[2], split[1] - 1, split[0], 0, 0, 0);
};