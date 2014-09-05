(function () {
    function registerApi(router) {
        var service = require('./ContactService.js');

        router.route('/contacts/types')
            .get(function (req, res, next) {
                var p = service.findTypes();
                p.then(function (types) {
                    res.status(200).json(types);
                }, function (err) {
                    res.status(500).end(err);
                })
            });

        router.route('/contacts/:type?')
            .get(function (req, res, next) {
                var p = service.find(req.params.type);
                p.then(function (contacts) {
                    res.status(200).json(contacts);
                }, function (err) {
                    res.status(500).end(err);
                });
            });

        router.route('/contacts/create/:name')
            .get(function (req, res, next) {
                var p = service.createType(req.params.name);
                p.then(function (contact) {
                    res.status(200).json(contact);
                }, function (err) {
                    res.status(500).end(err);
                });
            });
    };

    module.exports = registerApi;
})();