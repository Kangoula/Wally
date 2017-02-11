(function(){
  'use strict';

  angular
    .module('wally')
    .directive('graph', Template);

    function Template(){
      return {
        restrict: 'E',
        templateUrl: 'app/graph/graph.html'
      };
    }
})();
