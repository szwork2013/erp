(function () {
    function registerApi(router) {
        var service = require('./AccountingService.js');

        // rest 

        // event handlers
        var eventDispatcher = require('./EventDispatcher.js');
        eventDispatcher.handle('contact_created', service.onContactUpdate);
        eventDispatcher.handle('contact_updated', service.onContactUpdate);
    }

    module.exports = registerApi;
})();