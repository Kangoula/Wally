(function() {
    'use strict';

    angular
        .module('wally.graph')
        .controller('Graph', Graph);

    Graph.$inject = ['$scope']

    function Graph($scope) {
        var vm = this;

        console.log('graph');

    }
})();
