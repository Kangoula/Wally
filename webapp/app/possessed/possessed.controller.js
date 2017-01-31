(function() {
    'use strict';

    angular
        .module('wally.stock')
        .controller('Stock', Stock);

    Stock.$inject = ['$scope']

    function Stock($scope) {
        var vm = this;

        console.log('stock');

    }
})();
