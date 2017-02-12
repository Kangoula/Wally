(function () {
  'use strict';

  angular
    .module('wally')
    .directive('search', Template);

  function Template() {
    return {
      restrict: 'E',
      templateUrl: 'app/search/search.html'
    };
  }
})();