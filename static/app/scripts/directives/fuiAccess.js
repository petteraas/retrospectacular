'use strict';

angular.module('retrospectApp')
  .directive('fuiAccess',[ 'isLoggedIn', 'SERVICE_URL', function (isLoggedIn, SERVICE_URL) {
    return {
      templateUrl: 'views/directives/fuiAccess.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        SERVICE_URL = SERVICE_URL.replace(/\\:/, ':');

        scope.text = 'Sign In with Google';
        scope.url = SERVICE_URL + '/auth/google';
        isLoggedIn.get(function (response) {
          scope.elements = response;
          if (scope.elements.displayName) {
            scope.text = scope.elements.displayName;
            scope.url = SERVICE_URL + '/auth/logout';
            // This is not ideal. The page only shows 200
          }
        });
      }
    };
  }]);
