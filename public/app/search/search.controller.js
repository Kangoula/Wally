(function() {
    'use strict';

    angular
        .module('wally.search')
        .controller('Search', Search);

    Search.$inject = ['$scope', '$http']

    function Search($scope, $http) {
        var vm = this;
        vm.data = [];
        vm.title = 'Search';

        $scope.name = "search";

        // search stocks from ws
        var base_url = 'https://query.yahooapis.com/v1/public/yql?q=';
        var data = encodeURIComponent('select * from yahoo.finance.quotes where symbol = "YHOO"');
        var url2 = base_url + data + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
        
        $http.get(url2)
            .then(function(response) {
                console.log(response);
            vm.data = response.data;
        });
    }
})();
