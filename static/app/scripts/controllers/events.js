'use strict';

angular.module('retrospectApp')
    .controller('EventsCtrl', [
        '$scope',
        'socket',

        function ($scope, socket) {
            $scope.events = [];
            socket.on('connect', function () {
                console.log('socket connected');
                socket.on('message', function (data) {
                    var message = JSON.parse(data.message);
                    console.log(message);
                    $scope.events.push(message);
                });
            });
        }
    ]
);
