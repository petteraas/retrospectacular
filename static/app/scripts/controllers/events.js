'use strict';

angular.module('retrospectApp')
    .controller('EventsCtrl', [
        '$scope',
        'socket',

        function ($scope, socket) {
            $scope.events = [];
            socket.on('connect', function () {
                socket.on('message', function (data) {
                    console.log('data parsed', JSON.parse(data));
                    $scope.events.push(JSON.parse(data));
                });
            });
        }
    ]
);
