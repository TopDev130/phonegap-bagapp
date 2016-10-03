'use strict';

define([
    'app',
    'app-constants/auth.constants',
    'app-constants/roles.constants'
], function (app)
{

    app.run(run);

    run.$inject = ['$anchorScroll', '$rootScope', '$location', 'localStorageService', '$http', '$timeout', 'AuthenticationService', 'USER_ROLES', 'AUTH_EVENTS', '$log', '$mdDialog', 'bagCache', '$translate'];

    function run($anchorScroll, $rootScope, $location, localStorageService, $http, $timeout, AuthenticationService, USER_ROLES, AUTH_EVENTS, $log, $mdDialog, bagCache, $translate)
    {
        $rootScope.USER_ROLES = USER_ROLES;
        $http.defaults.cache = bagCache;
        $anchorScroll.yOffset = 60;
        $rootScope.globals = localStorageService.get('globals') || {
            currentUser: {
                role: USER_ROLES.guest
            }
        };
        
        if (!!localStorageService.get('appToken'))
        {
            AuthenticationService.setToken(localStorageService.get('appToken'));
        }
        if (!!$rootScope.globals.currentUser.authdata)
        {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.settings = localStorageService.get('settings') || {
            language: "en"
        };
        AuthenticationService.updateLocalSettings($rootScope.settings);

        $rootScope.$on('$routeChangeStart', function (event, next, current)
        {
            if (!!next.data)
            {
                var authorizedRoles = next.data.authorizedRoles;
                if (!AuthenticationService.isAuthorized(authorizedRoles))
                {
                    event.preventDefault();
                    if (AuthenticationService.isAuthenticated())
                    {
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        $location.path('/');
                    } else
                    {
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            }
        });
    }
});

