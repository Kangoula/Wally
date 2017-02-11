(function(){
  'use strict';

  angular
    .module('wally')
    .directive('mystocks', Template);

    function Template(){
      return {
        restrict: 'E',
        templateUrl: 'app/possessed/possessed.html'
      };
    }
})();
