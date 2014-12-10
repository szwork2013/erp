(function () {
    function registerApi(router) {
        var service = require('./ContactsService.js');
        var api = require('./Api.js');

        router.route('/:type?')
            .get(function (req, res, next) {
                var p = service.findContacts(req.params.type);
                api.processResponse(p, res);
            })
            .put(function (req, res, next) {
                var p = service.createContact(req.body);
                api.processResponse(p, res);
            });

        router.route('/:id')
            .post(function (req, res, next) {
                var p = service.updateContact(req.params.id, req.body);
                api.processResponse(p, res);
            });
    }

    module.exports = registerApi;
})();