'use strict';

angular.module('retrospectApp')
  .factory('isLoggedIn', ['$resource', 'SERVICE_URL',
    function ($resource, SERVICE_URL) {
      return $resource(SERVICE_URL + '/auth/loggedin');
    }
  ]);
