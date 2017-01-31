(function(){
  'use strict';

  angular
    .module('wally.stock')
    .directive('stock', Template);

    function Template(){
      return {
        restrict: 'E',
        templateUrl: 'app/possessed/possessed.html'
      };
    }
})();
