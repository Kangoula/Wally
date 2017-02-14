(function () {
    'use strict';

    angular
        .module('wally')
        .controller('MyStocks', MyStocks);

    MyStocks.$inject = ['$scope', 'Stock', '$rootScope', 'Search'];

    function MyStocks($scope, Stock, $rootScope, Search) {
        var vm = this;
        vm.all = [];
        vm.getCurrentPrice = getCurrentPrice;

        $scope.stocks = [];
        $scope.loading = true;
        $scope.search = false;
        $scope.mystocks = Stock;
        $scope.$on('stock.updated', updateStoks);

        Stock.query({}, onSuccess, onError);
        //updateStoks();

        function onSuccess(response) {

            if (response.length > 0) {
                // get current price for each Stock
                response.forEach(function (value) {
                    vm.getCurrentPrice(value)
                });
                $scope.loading = false;
                $scope.stocks = vm.all;
            } else {
                $scope.loading = false;
                $scope.stocks = [];
            }

        }

        function onError() {
            $scope.loading = false;
        }

        function updateStoks() {
            console.log("update stocks");
            $scope.loading = true;
            Stock.query({}, onSuccess, onError);
        }

        function getCurrentPrice(value) {
            Search.get({
                symbol: value.symbol
            }, function (res) {
                value.currentPrice = res.query.results.quote.Ask;
                vm.all.push(value);
            });
        }
    }
})();