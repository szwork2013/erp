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