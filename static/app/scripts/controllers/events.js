'use strict';

angular.module('retrospectApp')
    .controller('EventsCtrl', [
        '$scope',
        'socket',

        function ($scope, socket) {
            socket.on('connect', function () {
                socket.on('message', function (data) {
                    console.log('data parsed', JSON.parse(data));
                });
            });
        }
    ]
);
