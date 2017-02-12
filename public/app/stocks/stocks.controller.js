(function() {
    'use strict';

    angular
        .module('wally')
        .controller('Stocks', Stocks);

    Stocks.$inject = ['$scope', 'StocksService', '$rootScope']

    function Stocks($scope, StocksService, $rootScope) {
      
      $scope.buy = buy;

      function buy(stock){

        var s = {
          dateAdded: new Date(),
          name: stock.name,
          price: stock.price,
          symbol: stock.symbol
        };

        var rep = StocksService.save(s);

        $rootScope.$broadcast('stock.bought', rep);    
      }

    }
})();