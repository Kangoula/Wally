(function () {
    'use strict';

    angular
        .module('wally')
        .controller('Search', Search);

    Search.$inject = ['$scope', 'Stock', 'Search']

    function Search($scope, Stock, Search) {
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
            } else {
                $scope.loading = false;
                $scope.stocks = [];
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
            } else {
                $scope.stocks = [];
            }
        }

        function onError(err) {
            $scope.stocks = [];
            $scope.loading = false;
        }
    }
})();