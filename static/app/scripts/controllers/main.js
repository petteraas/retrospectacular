'use strict';

angular.module('retrospectApp')
    .controller('MainCtrl', [
        '$scope',
        'Page',

        function ($scope, Page) {
            $scope.Page = Page;
        }
    ]
);
