(function(){
  'use strict';

  angular
    .module('wally')
    .factory('Stocks', Stocks);

    Stocks.inject = ['$resource'];

    function Stocks($resource){
      var service = $resource('http://localhost:3000/api/stocks/:symbol', {}, {
        'query': {method: 'GET', isArray: true},
        'get': {
          method: 'GET',
          transformResponse: function(data){
            data = angular.fromJson(data);
            return data;
          }
        },
        'save': { method:'POST' },
        'update':  { method:'PUT' },
        'delete': { method: 'DELETE' }
      });

      return service;
    }
})();