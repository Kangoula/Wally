(function() {
    'use strict';

    angular
        .module('wally')
        .controller('Stocks', Stocks);

    Stocks.$inject = ['$scope', 'StocksService', '$rootScope']

    function Stocks($scope, StocksService, $rootScope) {
      
      $scope.buy = buy;

      function buy(stock){
        StocksService.save(stock)
        $rootScope.$broadcast('stock.bought', stock);    
      }

    }
})();