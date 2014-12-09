var require = {
    baseUrl: '/',
    paths: {
        'domReady': 'js/domReady',
        'angular': 'js/angular.min',
        'angular-route': 'js/angular-route.min',
        'angular-ui': 'js/ui-bootstrap-tpls-0.11.0.min',
        'underscore': 'js/underscore-min'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui': {
            deps: ['angular'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular'],
            exports: 'angular'
        },
        'underscore': {
            exports: '_'
        }
    }
};