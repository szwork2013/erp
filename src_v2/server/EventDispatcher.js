(function () {
    var zmq = require('zmq');
    var settings = require('./settings.json');

    function EventDispatcher() {
        this.entry = zmq.socket('pub');
        this.entry.bindSync(settings.eventdispatcher.address);
    }

    EventDispatcher.prototype.send = function (type, body) {
        var msg = type + '#' + JSON.stringify(body);
        this.entry.send(msg);
    }

    EventDispatcher.prototype.handle = function (type, callback) {
        var sub = zmq.socket('sub');
        var filter = type + '#';
        sub.subscribe(filter);
        sub.connect(settings.eventdispatcher.address);
        sub.on('message', function (args) {
            var msg;
            if (Object.prototype.toString.call(args) === '[object Array]') {
                msg = args.join('');
            }
            else {
                msg = args.toString();
            }

            msg = msg.substring(filter.length);

            callback(JSON.parse(msg));
        });
    }

    module.exports = new EventDispatcher();
})();