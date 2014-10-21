require(['angular'], function (angular) {
    var services = angular.module('CommonServices', []);

    services.factory('$common', [
        '$filter',
        function ($filter) {
            return {
                findDates: function (backwards, forwards) {
                    var now = new Date();
                    var dates = [];
                    for (var i = -1 * backwards; i <= forwards; i++) {
                        var d = new Date().setDate(now.getDate() + i);
                        dates.push({ date: d, text: $filter('date')(d, 'dd/MM/yyyy') });
                    }

                    return dates;
                }
            };
        }
    ]);
});