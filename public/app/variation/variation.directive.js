(function(){
  'use strict';

  angular
    .module('wally')
    .directive('variation', Template);

    function Template(){
      return {
        restrict: 'E',
        templateUrl: 'app/variation/variation.html'
      };
    }
})();
