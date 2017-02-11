(function() {
    'use strict';

    angular
        .module('wally')
        .controller('MyStocks', MyStocks);

    MyStocks.$inject = ['$scope']

    function MyStocks($scope) {
        var vm = this;

        console.log('stock');

    }
})();
