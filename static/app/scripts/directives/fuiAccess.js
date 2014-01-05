'use strict';

angular.module('retrospectApp')
  .directive('fuiAccess',[ 'isLoggedIn', function (isLoggedIn) {
    return {
      templateUrl: 'views/directives/fuiAccess.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        scope.text = 'Sign In with Google';
        scope.url = '/auth/google';
        isLoggedIn.get(function (response) {
          scope.elements = response;
          if (scope.elements.displayName) {
            scope.text = scope.elements.displayName;
            scope.url = '/auth/logout';
            // This is not ideal. The page only shows 200
          }
        });
      }
    };
  }]);
