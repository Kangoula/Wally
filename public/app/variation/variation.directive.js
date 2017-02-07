(function(){
  'use strict';

  angular
    .module('wally.variation')
    .directive('variation', Template);

    function Template(){
      return {
        restrict: 'E',
        templateUrl: 'app/variation/variation.html'
      };
    }
})();
