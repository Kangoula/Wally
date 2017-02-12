(function () {
    'use strict';

    angular
        .module('wally')
        .controller('MyStocks', MyStocks);

    MyStocks.$inject = ['$scope', 'StocksService', '$rootScope'];

    function MyStocks($scope, StocksService, $rootScope) {
        var vm = this;

        $scope.stocks = [];
        $scope.loading = true;
        $scope.search = false;
        $scope.mystocks = StocksService;
        $scope.$on('stock.bought', updateStoks);

        StocksService.query({}, onSuccess, onError);

        function onSuccess(response) {
            $scope.loading = false;
            $scope.stocks = response;
        }

        function onError() {
            $scope.loading = false;
        }

        function updateStoks(event, value) {
            $scope.stocks.unshift(value);
        }
    }
})();