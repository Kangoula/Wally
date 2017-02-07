(function() {
    'use strict';

    angular
        .module('wally.variation')
        .controller('Variation', Variation);

    Variation.$inject = ['$scope']

    function Variation($scope) {
      var vm = this;
      $scope.chart = null;
      console.log('variation');

      $scope.showChart = function() {
        $scope.chart = c3.generate({
          bindto: '#chart',
          data: {
            columns: [
              ['data1', 30, 200, 100, 400, 150, 250],
              ['data2', 50, 20, 10, 40, 15, 25]
            ]
          }
        });
      }
    }
})();
