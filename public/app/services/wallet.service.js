(function () {
  'use strict';

  angular
    .module('wally')
    .factory('Wallet', Wallet);

  Wallet.inject = ['$resource'];

  function Wallet($resource) {
    var service = $resource('http://localhost:3000/api/wallet', {}, {
      'query': {
        method: 'GET',
      },
      'get': {
        method: 'GET',
      },
      'post': {
        method: 'POST',
        transformResponse: function(data) {
          return angular.fromJson(data);
        }
      }
    });

    return service;
  }
})();