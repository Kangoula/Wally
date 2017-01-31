(function() {
    'use strict';

    angular
        .module('wally.variation')
        .controller('Variation', Variation);

    Variation.$inject = ['$scope']

    function Variation($scope) {
        var vm = this;

        console.log('variation');

    }
})();
