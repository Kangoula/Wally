(function() {
  'use strict';

  angular
  .module('wally')
  .controller('Graph', Graph);

  Graph.$inject = ['$scope']

  function Graph($scope) {
    var vm = this;
    console.log('graph');

    $scope.graph = null;

    $scope.showGraph = function() {
      $scope.chart = c3.generate({
        bindto: '#graph',
        data: {
          columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 130, 100, 140, 200, 150, 50]
          ],
          type: 'bar'
        },
        bar: {
          width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
          }
        }
      });
    }
  }
})();
