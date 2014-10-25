(function () {
    function registerApi(router) {
        var service = require('./ContactsService.js');
        var api = require('./Api.js');

        router.route('/contacts/:type?')
            .get(function (req, res, next) {
                var p = service.findContacts(req.params.type);
                api.processResponse(p, res);
            });

        router.route('/contacts/contact/:id')
            .get(function (req, res, next) {
                var p = service.getContact(req.params.id);
                api.processResponse(p, res);
            })

        router.route('/contacts')
            .put(function (req, res, next) {
                var p = service.createContact(req.body.name, req.body.type);
                api.processResponse(p, res);
            })
    };

    module.exports = registerApi;
})();