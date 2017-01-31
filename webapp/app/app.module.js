(function(){
	'use strict';

	angular
		.module('wally', [
			'ngRoute',
			'wally.search',
			'wally.stock',
			'wally.variation',
			'wally.graph'
		]);
})();
