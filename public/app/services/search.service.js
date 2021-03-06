(function () {
  'use strict';

  angular
    .module('wally')
    .factory('Search', Search);

  Search.inject = ['$resource'];

  function Search($resource) {
    var service = $resource('http://localhost:3000/api/search/:symbol', {}, {
      'get': {
        method: 'GET',
        transformResponse: function (data) {
          if(data !== "Not Found"){
            return angular.fromJson(data);
          } else {
            return 404;
          }
        }
      }
    });

    return service;
  }
})();