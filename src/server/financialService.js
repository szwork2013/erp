var ravendb = require('ravendb');
var settings = require('./settings');
var _ = require('underscore');
var q = require('q');

var db = ravendb(settings.db.host, settings.db.name);

var fromDocument = function(doc) {
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

exports.findAccounts = function () {
    var page = 0;
    var pageSize = 128;

    var deferred = q.defer();

    db.getDocsInCollection('Accounts', page * pageSize, pageSize, function (err, result) {
        if (err) {
            deferred.reject(err);
        }
        else {
            _.each(result, fromDocument);
            deferred.resolve(result);
        }
    });

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
}