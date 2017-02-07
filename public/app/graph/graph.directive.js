(function(){
  'use strict';

  angular
    .module('wally.graph')
    .directive('graph', Template);

    function Template(){
      return {
        restrict: 'E',
        templateUrl: 'app/graph/graph.html'
      };
    }
})();
