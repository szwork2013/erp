var q = require('q');

function one(value) {
    var d = q.defer();
    setTimeout(function () {
        console.log('step one: ' + value);
        d.resolve(value + 1);
    }, 1000);
    return d.promise;
}

function two(value) {
    var d = q.defer();
    setTimeout(function () {
        console.log('step two: ' + value);
        d.resolve(value+1);
    }, 1000);
    return d.promise;
}

function three(value) {
    console.log('step three: ' + value);
}

one(10).then(two).done(three);