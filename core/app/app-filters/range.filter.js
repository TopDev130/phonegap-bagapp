'use strict';

define(['app'], function(app) {
	
	app.filter('range', function() {
		return function(input, total) {
			total = parseInt(total);
			for (var i=0; i<total; i++) {
				input.push(i);
			}
			return input;
		};
	});
        
        app.filter('rangeShift', function() {
		return function(input, total) {
			total = parseInt(total);
			for (var i=1; i<=total; i++) {
                            i = (i < 10) ? ("0" + i) : i;
                            input.push(i);
			}
			return input;
		};
	});
        
        app.filter('rangeYear', function() {
		return function(input) {
                    var today = new Date();
                    var year = today.getFullYear();
			for (var i=0; i<120; i++) {
                            input.push(year);
                            year--;
			}
			return input;
		};
	});
	
	app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
});