(function(){
  'use strict';

  angular
    .module('wally')
    .factory('StocksService', StocksService);

    StocksService.inject = ['$resource'];

    function StocksService($resource){
      var service = $resource('http://localhost:3000/api/stocks/:symbol', {}, {
        'query': {method: 'GET', isArray: true},
        'get': {
          method: 'GET',
          transformResponse: function(data){
            data = angular.fromJson(data);
            return data;
          }
        },
        'save': { 
          method:'POST'
        },
        'update':  { method:'PUT' },
        'delete': { method: 'DELETE' }
      });

      return service;
    }
})();