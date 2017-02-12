(function () {
  'use strict';

  angular
    .module('wally')
    .controller('Variation', Variation);

  Variation.$inject = ['$scope', '$http', '$rootScope'];

  function Variation($scope, $http) {
    var vm = this;
    $scope.chart = null;
    $scope.showChart = showChart;
    $scope.$on('stock.bought', updateGraph);

    vm.x = ['date'];
    vm.y = ['wallet'];


    setTimeout(function () {
      $http({
        method: 'GET',
        url: '/api/stats/wallet'
      }).then(function onSuccess(response) {

        var dates = response.data.x.map(function (val) {
          return new Date(val);
        });

        vm.x.push.apply(vm.x, dates);
        vm.y.push.apply(vm.y, response.data.y);
        $scope.chart.load({
          columns: [
            vm.x,
            vm.y
          ]
        });
      });
    }, 1000);

    function updateGraph(event, value) {

      vm.x.push(value.dateAdded);
      if (vm.y.length > 1) {
        vm.y.push(Number(vm.y[vm.y.length - 1]) + Number(value.price));
      } else {
        vm.y.push(Number(value.price));
      }

      console.log(vm.x, vm.y);

      $scope.chart.load({
        columns: [
          vm.x,
          vm.y
        ]
      });
    }

    function showChart() {
      $scope.chart = c3.generate({
        bindto: '#chart',
        data: {
          x: 'date',
          columns: [
            vm.x,
            vm.y
          ],
          type: 'area'
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              rotate: 90,
              fit: false,
              centered: true,
              format: '%Y-%m-%d %H:%M:%S '
            },
          }
        }
      });
    }
  }
})();