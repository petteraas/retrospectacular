'use strict';

angular.module('retrospectApp')
  .factory('Page', function () {
    var title = 'Retrospectacular';
    return {
      title: function () {
        return title;
      },
      setTitle: function (newTitle) {
        title = newTitle;
      }
    };
  });
