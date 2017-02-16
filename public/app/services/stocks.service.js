(function () {
  'use strict';

  angular
    .module('wally')
    .factory('Stock', Stock);

  Stock.inject = ['$resource'];

  function Stock($resource) {

    var service = $resource('http://localhost:3000/api/stocks/:id', {}, {
      'query': {
        method: 'GET',
        isArray: true
      },
      'get': {
        method: 'GET',
        transformResponse: function (data) {
          data = angular.fromJson(data);
          return data;
        }
      },
      'save': {
        method: 'POST',
        transformResponse: function(data){
          return angular.fromJson(data);
        }
      },
      'update': {
        method: 'PUT'
      },
      'delete': {
        method: 'DELETE'
      }
    });

    return service;
  }
})();