(function () {
    function EventCount() {
        this.value = 0;
        this.queue = [];
        this.q = require('q');
    }

    EventCount.prototype.advance = function () {
        this.value = this.value++;
        this.checkValues();
        return this.value;
    };

    EventCount.prototype.read = function () {
        return this.value;
    };

    EventCount.prototype.await = function (value) {
        var d = this.q.defer();
        this.queue.push({ d: d, await: value });
        return d.promise;
    };

    EventCount.prototype.checkValues = function () {
        var _queue = this.queue;
        this.queue = [];
        for (var idx = 0; idx < _queue.length; idx++) {
            var i = _queue[idx];
            if (i.await >= this.value) {
                i.d.resolve();
            }
            else {
                this.queue.push(i);
            }
        }
    };

    module.exports = EventCount;
})();