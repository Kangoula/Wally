(function () {
  'use strict';

  angular
    .module('wally')
    .controller('Stocks', Stocks);

  Stocks.$inject = ['$scope', 'Stock', '$rootScope', 'Search', 'Wallet']

  function Stocks($scope, Stock, $rootScope, Search, Wallet) {

    var vm = this;
    vm.tot = 0;

    $scope.buy = buy;
    $scope.sell = sell;

    function sell(stock){
      
      // delete stock from db
      console.log("sell");
      Stock.delete({
        id: stock._id,
      }, (res) => {
        $rootScope.$broadcast('stock.updated');
      });

      // add current value to wallet
      Wallet.post({
        price: stock.currentPrice, 
        type: "+"
      }, (res) => {
        // broadcast
        $rootScope.$broadcast('wallet.updated', res);
      });
    }

    function buy(stock) {
      // var s = 

      Stock.save({
        //dateAdded: new Date(),
        name: stock.name,
        price: stock.price,
        symbol: stock.symbol.toUpperCase()
      }, (res) => {
        $rootScope.$broadcast('stock.updated');
      });
      // remove current value to Wallet
      Wallet.post({
        price: stock.price,
        type: "-"
      }, (res) => {
        $rootScope.$broadcast('wallet.updated', res);
      });
    }

  }
})();