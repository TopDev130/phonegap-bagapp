'use strict';

define(['app'], function(app) {
	app.factory('bagCache', ['$cacheFactory', function($cacheFactory) {
		return $cacheFactory('bag-cache');
	}]);
});