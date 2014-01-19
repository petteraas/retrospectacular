'use strict';

angular.module('retrospectApp')
    .factory('timings', [
        '$resource',
        'SERVICE_URL',

        function ($resource, SERVICE_URL) {
            return $resource(SERVICE_URL + '/stats/timings/');
        }
    ]);
