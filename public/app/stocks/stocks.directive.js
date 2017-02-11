(function(){
  'use strict';

  angular
    .module('wally')
    .directive('stocks', Template);

  function Template(){
    return {
      restrict: 'E',
      scope: {
        list: "=",
        loading: "=",
        search: "="
      },
      templateUrl: 'app/stocks/stocks.html'
    };
  }
})();