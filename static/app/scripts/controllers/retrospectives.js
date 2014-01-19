'use strict';

angular.module('retrospectApp')
    .controller('RetroCtrl', [
        '$scope',
        '$location',
        'retrospectives',
        'timings',
    function ($scope, $location, retrospectives, timings) {
        $scope.retrospectives = [];
        $scope.newRetrospective = {};

        $scope.logTiming = function(timings) {
            var now = new Date().getTime(),

                output = {
                    "requestStart" : now - performance.timing.requestStart,
                    "responseStart" : now - performance.timing.responseStart,
                    "responseEnd" : now - performance.timing.responseEnd,
                    "loadEventStart" : now - performance.timing.loadEventStart,
                    "loadEventEnd" : now - performance.timing.loadEventEnd,
                    "pageLoadTime" : now - performance.timing.navigationStart
                };
            console.log('output', output);
            timings.save(output, function(savedTiming) {
                console.log('savedTiming', savedTiming);
            }, function(error) {
                console.error('Error saving timing', error);
            });
        };

        $scope.saveRetrospective = function () {
            var retrospective;

            if ($scope.retroAddForm.$valid) {
                retrospective = angular.copy($scope.newRetrospective);

                // Sending plan data to the service
                retrospectives.save($scope.newRetrospective, function (savedRetrospective) {
                    $scope.retrospectives.push(savedRetrospective);
                    $location.path('/retrospectives/' + savedRetrospective.id);

                }, function (error) {
                    console.error('Error saving retrospective', error);
                });

            } else {
                console.warn('Errors in form data');
            }
        };

        // this throws an error with cross domain
        retrospectives.get(function (response) {
            $scope.retrospectives = response.results;
        });
        $scope.$on('$viewContentLoaded', function() {
            $scope.logTiming(timings);
        });
    }
]);
