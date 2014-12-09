(function () {
    var domain = require('./AccountingDomain.js');
    var q = require('q');

    function AccountingService() {

    }

    AccountingService.prototype.onContactUpdate = function (contact) {

        var promises = [];

        var findAndUpdate = function (type) {
            var d = q.defer();
            domain.LedgerAccount.findOne({ contact: contact._id, type: type }, function (err, la) {
                if (err) {
                    d.reject(err);
                    return;
                }

                if (!la) {
                    la = new domain.LedgerAccount({ type: type, contact: contact._id });
                }

                la.name = contact.name;
                la.save(d.makeNodeResolver());
            });

            return d.promise;
        }

        if (contact.type.customer) {
            promises.push(findAndUpdate('customer'));
        }

        if (contact.type.supplier) {
            promises.push(findAndUpdate('supplier'));
        }

        if (!contact.type.customer && !contact.type.supplier) {
            var d = q.defer();
            d.resolve();
            promises.push(d.promise);
        }

        return q.all(promises);
    }

    module.exports = new AccountingService();
})();