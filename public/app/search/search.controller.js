(function () {
    'use strict';

    angular
        .module('wally')
        .controller('Search', Search);

    Search.$inject = ['$scope', 'StocksService', 'Search']

    function Search($scope, StocksService, Search) {
        var vm = this;
        vm.title = 'Search';

        $scope.toSearch = "";
        $scope.stocks = [];
        $scope.onChange = onChange;
        $scope.loading = false;
        $scope.search = true;

        function onChange() {
            var value = $scope.toSearch;
            if (value.length > 1) {
                $scope.loading = true;
                Search.get({
                    symbol: value
                }, onSuccess, onError);
            }
        }

        function onSuccess(response) {
            $scope.loading = false;
            if (response.query.results.quote.Ask) {
                var stock = response.query.results.quote;
                $scope.stocks[0] = {
                    name: stock.Name,
                    price: stock.Ask,
                    symbol: stock.Symbol
                };
            }
        }

        function onError(err) {
            $scope.loading = false;
        }
    }
})();