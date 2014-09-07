(function () {
    function registerApi(router) {
        var service = require('./TimeRegistrationService.js');

        router.route('/timeregistration')
        .get(function (req, res, next) {
            var p = service.find();
            p.then(function (result) {
                res.status(200).json(result);
            }, function (err) {
                res.status(500).end(err);
            })
        })
        .post(function (req, res, next) {
            var p = service.create(req.body.employee, req.body.project, req.body.date, req.body.description, req.body.hours);
            p.then(function (result) {
                res.status(200).json(result);
            }, function (err) {
                res.status(500).end(err);
            })
        });
    };

    module.exports = registerApi;
})();