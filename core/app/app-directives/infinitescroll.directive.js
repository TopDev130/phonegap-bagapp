'use strict';

define(['app'], function(app) {
	app.directive('infiniteScroll', [
		  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
			return {
			  link: function(scope, elem, attrs) {
				var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
				$window = angular.element($window);
				scrollDistance = 0;
				if (attrs.infiniteScrollDistance != null) {
				  scope.$watch(attrs.infiniteScrollDistance, function(value) {
					return scrollDistance = parseInt(value, 10);
				  });
				}
				scrollEnabled = true;
				checkWhenEnabled = false;
				if (attrs.infiniteScrollDisabled != null) {
				  scope.$watch(attrs.infiniteScrollDisabled, function(value) {
					scrollEnabled = !value;
					if (scrollEnabled && checkWhenEnabled) {
					  checkWhenEnabled = false;
					  return handler();
					}
				  });
				}
				handler = function() {
				  var elementBottom, remaining, shouldScroll, windowBottom;
				  windowBottom = $window.height() + $window.scrollTop();
				  elementBottom = elem.offset().top + elem.height();
				  remaining = elementBottom - windowBottom;
				  shouldScroll = remaining <= $window.height() * scrollDistance;
				  
				  windowBottom = elem.height() + elem.scrollTop();
				  elementBottom = elem[0].scrollHeight;
				  remaining = elementBottom - windowBottom;
				  shouldScroll = remaining <= elem.height() * scrollDistance;
				  //console.log(elem[0].scrollHeight, elem.scrollTop(), remaining, shouldScroll);
				  if (shouldScroll && scrollEnabled) {
					if ($rootScope.$$phase) {
					  return scope.$eval(attrs.infiniteScroll);
					} else {
					  return scope.$apply(attrs.infiniteScroll);
					}
				  } else if (shouldScroll) {
					return checkWhenEnabled = true;
				  }
				};
				elem.on('scroll', handler);
				scope.$on('$destroy', function() {
				  return elem.off('scroll', handler);
				});
				return $timeout((function() {
				  if (attrs.infiniteScrollImmediateCheck) {
					if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
					  return handler();
					}
				  } else {
					return handler();
				  }
				}), 0);
			  }
			};
		  }
		]);
		
});