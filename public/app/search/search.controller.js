(function() {
    'use strict';

    angular
        .module('wally')
        .controller('Search', Search);

    Search.$inject = ['$scope', 'Stocks']

    function Search($scope, Stocks) {
        var vm = this;
        vm.title = 'Search';

        $scope.toSearch = "";
        $scope.stocks = [];
        $scope.onChange = onChange;

        function onChange(){
            var value = $scope.toSearch;
            if(value.length > 1){
                 Stocks.query({}, onSuccess, onError);
            }
        }

       

        function onSuccess(response){
            $scope.stocks = response;
        }

        function onError(){
            console.log("error");
        }

        // $http.get("http://localhost:3000/stocks")
        // .then(function(response){
        //     if(response.status === 200){
        //         console.log(response);
        //         $scope.stocks = response.data;
        //     }else {

        //     }
        // });
        // search stocks from ws
        // var base_url = 'https://query.yahooapis.com/v1/public/yql?q=';
        // var data = encodeURIComponent('select * from yahoo.finance.quotes where symbol = "YHOO"');
        // var url2 = base_url + data + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
        
        // $http.get(url2)
        //     .then(function(response) {
        //         console.log(response);
        //     vm.data = response.data;
        // });
    }
})();
