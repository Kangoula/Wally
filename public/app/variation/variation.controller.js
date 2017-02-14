(function () {
  'use strict';

  angular
    .module('wally')
    .controller('Variation', Variation);

  Variation.$inject = ['$scope', '$rootScope', 'Wallet'];

  function Variation($scope, $http, Wallet) {
    var vm = this;
    $scope.chart = null;
    $scope.showChart = showChart;
    $scope.$on('wallet.updated', updateGraph);

    vm.x = ['date'];
    vm.y = ['montant du portefeuille (USD)'];

    Wallet.query({}, onSuccess);

    setTimeout(function () {
      $scope.chart.load({
          columns: [
            vm.x,
            vm.y
          ]
        });
    }, 1000);

    function onSuccess(response){
      // convert String into date
      var dates = response.x.map(function (val) {
          return new Date(val);
        });

      vm.x.push.apply(vm.x, dates);
      vm.y.push.apply(vm.y, response.y);
    }

    function updateGraph(event, value) {
      // get latest wallet value from event
      vm.x.push(new Date(value.date));
      vm.y.push(Number(value.total));

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
          ]
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              rotate: 105,
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