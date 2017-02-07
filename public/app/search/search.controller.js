(function() {
    'use strict';

    angular
        .module('wally.search')
        .controller('Search', Search);

    Search.$inject = ['$scope']

    function Search($scope) {
        var vm = this;
        vm.stocks = [];
        vm.title = 'Search';

        $scope.name = "test";

        console.log('ok');

    }
})();
