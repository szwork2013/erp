var ravendb = require('ravendb');
var settings = require('./settings');
var _ = require('underscore');
var q = require('q');
var uuid = require('node-uuid');
var request = require('request');
var url = require('url');

var db = ravendb(settings.db.host, settings.db.name);

var fromDocument = function (doc) {
    if (doc['@metadata']) {
        if (doc['@metadata']['@id']) {
            doc.id = doc['@metadata']['@id'];
        }
        else if (doc['@metadata']['__document_id']) {
            doc.id = doc['@metadata']['__document_id'];
        }

        delete doc['@metadata'];
    }

    return doc;
};

exports.findAccountTypes = function () {
    return [
        'Kosten',
        'Opbrengsten',
        'Bankrekening'
    ];
};

exports.findAccounts = function (type) {
    var page = 0;
    var pageSize = 128;

    var deferred = q.defer();

    if (type == '') {
        db.getDocsInCollection('Accounts', page * pageSize, pageSize, function (err, result) {
            if (err) {
                deferred.reject(err);
            }
            else {
                _.each(result, fromDocument);
                deferred.resolve(result);
            }
        });
    }
    else {
        db.queryByIndex('AccountsByType', { type: type }, 0, 128, function (err, result) {
            if (err) {
                deferred.reject(err);
            }
            else {
                result = JSON.parse(result.body).Results;
                if (result) {
                    _.each(result, fromDocument);
                    deferred.resolve(result);
                }
                else {
                    deferred.resolve([]);
                }
            }
        });
    }

    return deferred.promise;
};

exports.createAccount = function (name, type) {
    var deferred = q.defer();

    var account = {};
    account.name = name;
    account.type = type;

    db.saveDocument('Accounts', account, function (err, result) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};

exports.saveTransactions = function (transactions) {
    var deferred = q.defer();

    try {
        var ravenBulkOperations = [];

        var prepareTransaction = function (transaction) {
            var t = transaction;
            t.accountid = t.account.id;
            delete t.account;
            return t;
        }

        var addBulkOperation = function (transaction) {
            ravenBulkOperations.push({
                Method: 'PUT',
                Document: prepareTransaction(transaction),
                Key: uuid.v4(),
                Metadata: {
                    'Raven-Entity-Name': 'Transactions'
                }
            });
        };

        _.each(transactions, addBulkOperation);

        var bulkRequestUrl = url.parse(db.getBulkDocsUrl());

        var requestOptions = {
            url: bulkRequestUrl,
            method: 'POST',
            body: JSON.stringify(ravenBulkOperations),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        function callback(error, response, body) {
            console.log(error);
            console.log(response.statusCode);
        }

        request(requestOptions, function (error, res, body) {
            if (res.statusCode == 200) {
                deferred.resolve();
            }
            else {
                deferred.reject(body);
            }
        });
    }
    catch (ex) {
        console.log(ex);
        deferred.reject(ex);
    }

    return deferred.promise;
};