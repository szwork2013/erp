(function () {
    var domain = require('./Domain.js');
    for (var i in domain) {
        module.exports[i] = domain[i];
    }

    var mongoose = require('mongoose');

    
})();