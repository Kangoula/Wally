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
        $scope.$on('stock.updated', updateStoks);

        Stock.query({}, onSuccess, onError);
        //updateStoks();

        function onSuccess(response) {
             var back = angular.copy($scope.stocks);
             $scope.stocks = back;
            if (response.length > 0) {
                vm.all = [];
                // get current price for each Stock
                response.forEach(function (value) {
                    vm.getCurrentPrice(value);
                });
                $scope.loading = false;
                console.log(vm.all);
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

        function getCurrentPrice(stock) {
            Search.get({
                symbol: stock.symbol
            }, (res) => {
                stock.currentPrice = res.query.results.quote.Ask;
                vm.all.push(stock);
            });
        }
    }
})();