'use strict';

define(['app'], function (app)
{
    app.directive('resolveLoader', ['$rootScope', '$timeout', '$mdDialog', '$location', '$log', function ($rootScope, $timeout, $mdDialog, $location, $log)
        {

            return {
                link: function (scope, element)
                {

                    $rootScope.$on('$routeChangeStart', function (event, currentRoute, previousRoute)
                    {
                        element.removeClass('ng-hide');
                    });
                    $rootScope.$on('$routeChangeSuccess', function (event, currentRoute, previousRoute)
                    {
                        element.addClass('ng-hide');
                    });
                    $rootScope.$on('$routeChangeError', function (event, currentRoute, previousRoute, rejection)
                    {
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title('Error')
                                .textContent(rejection)
                                .ariaLabel('Error')
                                .ok('Ok')
                                );
                        if (!angular.isUndefined(previousRoute))
                        {
                            var fullRoute = previousRoute.$$route.originalPath,
                                    routeParams = previousRoute.params,
                                    resolvedRoute = fullRoute;
                            for (var key in routeParams)
                            {
                                resolvedRoute = resolvedRoute.replace(":" + key, routeParams[key]);
                            }
                            $location.path(resolvedRoute);
                        } else
                        {
                            $location.path("/");
                        }
                        element.addClass('ng-hide');
                    });
                }
            };
        }]);

});