

define('app',[
    'angular',
    'angularRoute',
    'angularResource',
    'angularLocalStorage',
    'ngMessages',
    'ngMaterial',
    'angularTranslateLoaderStaticFiles'
], function (angular)
{
    return window.app = angular.module('bagApp', [
        'ngRoute',
        'ngResource',
        'LocalStorageModule',
        'ngMessages',
        'ngMaterial',
        'pascalprecht.translate',
        'ui.calendar'
    ]);
});


define('app-constants/auth.constants',['app'], function (app) {
    
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });
    
});


define('app-constants/roles.constants',['app'], function(app) {
    
    app.constant('USER_ROLES', {
        all : '*',
        admin : 'admin',
        guide : 'guida',
        client: 'cliente',
        guest : 'guest'
    });
});


define('app-constants/config.constants',['app'], function(app) {
    
    app.constant('APP_CONSTANTS', {
        debugIsOn : false,
        localDev : false,
        localPush : false
    });
});
 // jshint ignore:line

define('config',[// jshint ignore:line
    'app',
    'moment',
    'app-constants/auth.constants',
    'app-constants/roles.constants',
    'app-constants/config.constants',
], function (app, moment)
{

    app.config(config);

    config.$inject = ['$routeProvider', '$locationProvider', 'localStorageServiceProvider', '$mdThemingProvider', '$translateProvider', 'USER_ROLES', '$logProvider', '$httpProvider', '$mdDateLocaleProvider', 'APP_CONSTANTS'];

    function config($routeProvider, $locationProvider, localStorageServiceProvider, $mdThemingProvider, $translateProvider, USER_ROLES, $logProvider, $httpProvider, $mdDateLocaleProvider, APP_CONSTANTS)
    {

        $routeProvider
                .when('/login', {
                    templateUrl: 'app/login/login.view.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    data: {
                        authorizedRoles: [USER_ROLES.guest]
                    }
                })
                .when('/guide/agenda', {
                    templateUrl: 'app/guide/agenda/guide.agenda.view.html',
                    controller: 'GuideAgendaController',
                    controllerAs: 'vm',
                    data: {
                        authorizedRoles: [USER_ROLES.guide, USER_ROLES.admin]
                    }
                })
                .when('/guide/agenda/events', {
                    templateUrl: 'app/guide/agenda/events/guide.agenda.events.view.html',
                    controller: 'GuideAgendaEventsController',
                    controllerAs: 'vm',
                    data: {
                        authorizedRoles: [USER_ROLES.guide, USER_ROLES.admin]
                    },
                    resolve: {
                        events: ['AuthenticationService', function (AuthenticationService)
                            {
                                return AuthenticationService.getRequestsList();
                            }]
                    }
                })
                .when('/guide/agenda/events/:id', {
                    templateUrl: 'app/guide/agenda/event/guide.agenda.event.view.html',
                    controller: 'GuideAgendaEventController',
                    controllerAs: 'vm',
                    data: {
                        authorizedRoles: [USER_ROLES.guide, USER_ROLES.admin]
                    },
                    resolve: {
                        event: ['$route', 'AuthenticationService', function ($route, AuthenticationService)
                            {
                                return AuthenticationService.getEvent($route.current.params.id);
                            }]
                    }
                })
                .when('/', {
                    resolve: {
                        load: ['$q', '$rootScope', '$location', function ($q, $rootScope, $location)
                            {
                                var deferred = $q.defer();
                                var path = "/guide/agenda/events";
                                if ($rootScope.globals.currentUser.role === USER_ROLES.client)
                                {
                                    path = "/client";
                                }
                                $location.path(path);
                                deferred.resolve("load");
                                return deferred.promise;
                            }]
                    },
                    data: {
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.guide, USER_ROLES.client]
                    }
                })
                .otherwise({redirectTo: '/'});

        //$locationProvider.html5Mode(true).hashPrefix('!');

        localStorageServiceProvider.setPrefix('bag');


        $mdThemingProvider.definePalette('bagPalette', {
            '50': 'ffebee',
            '100': 'aad7eb',
            '200': 'ef9a9a',
            '300': 'f1943f',
            '400': 'ef5350',
            '500': '0b98d6',
            '600': 'F1943F',
            '700': 'd32f2f',
            '800': 'c62828',
            '900': 'b71c1c',
            'A100': 'ff8a80',
            'A200': 'ff5252',
            'A400': 'ff1744',
            'A700': 'd50000',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50', '100',
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined
        });
        $mdThemingProvider.theme('default')
                .primaryPalette('bagPalette');

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
//        moment.locale('it', {
//            months: 'Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre'.split('_'),
//            monthsShort: 'Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic'.split('_'),
//            weekdaysMin: 'D_L_M_M_G_V_S'.split('_')
//        });
//        moment.locale('en', {
//            weekdaysMin: 'S_M_T_W_T_F_S'.split('_')
//        });
        moment.locale('en');
//        $mdDateLocaleProvider.firstDayOfWeek = 1;
//        $mdDateLocaleProvider.formatDate = function (date)
//        {
//            return moment(date).format('dddd DD/MM/YYYY');
//        };

        $logProvider.debugEnabled(APP_CONSTANTS.debugIsOn);

        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
});


define('run',[
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




define('app-directives/infinitescroll.directive',['app'], function(app) {
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


define('app-directives/resolveloader.directive',['app'], function (app)
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


define('app-factories/cache.factory',['app'], function(app) {
	app.factory('bagCache', ['$cacheFactory', function($cacheFactory) {
		return $cacheFactory('bag-cache');
	}]);
});


define('app-services/authentication.service',[
    'app',
    'moment',
    'jquery'
], function (app, moment, jQuery)
{

    app.factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['localStorageService', '$http', '$q', '$rootScope', '$timeout', '$translate', '$log', 'APP_CONSTANTS', 'USER_ROLES', 'AUTH_EVENTS', 'PUSH', '$mdDateLocale'];

    function AuthenticationService(localStorageService, $http, $q, $rootScope, $timeout, $translate, $log, APP_CONSTANTS, USER_ROLES, AUTH_EVENTS, PUSH, $mdDateLocale)
    {
        var TAG = "AuthenticationService";
        var host = "http://bookaguide.online/bagapp/index.php/serviceapi";
        host = "http://vpn.labbit.it/bag/index.php/serviceapi";
        var ext = "";
        var timeoutLong = 0;
        if (APP_CONSTANTS.localDev)
        {
            host = "json";
            ext = ".json";
            timeoutLong = 100;
        }
        var service = {
            start: 0,
            perPage: 5,
            method: 'POST',
            login: function (username, password)
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/login' + ext,
                        method: service.method,
                        data: $.param({user: username, passwd: password}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "login", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        if (APP_CONSTANTS.localDev)
                        {
                            if (username !== 'guida' || password !== 'guida')
                            {
                                deferred.reject(inReturn.msg);
                                return;
                            }
                        }
                        service.setToken(inReturn.token);
                        $rootScope.globals.currentUser.role = USER_ROLES.guide;
                        service.setCredentials(username, password, inReturn);
                        deferred.resolve(true);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "login", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            getEvent : function (id)
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/getEvent/' + service.token + ext,
                        method: service.method,
                        data: $.param({id: id}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "getEvent", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        if(!inReturn.data)
                        {
                            deferred.reject('Event not found or already completed');
                            return;
                        }
                        deferred.resolve(inReturn.data);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "getEvent", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            getEventsList : function ()
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/getEventsList/' + service.token + ext,
                        method: service.method,
                        data: $.param({token:service.token}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "getEventsList", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        deferred.resolve(inReturn.data);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "getEventsList", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            getRequestsList : function ()
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/getRequestsList/' + service.token + ext,
                        method: service.method,
                        data: $.param({token:service.token}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "getRequestsList", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        deferred.resolve(inReturn.data);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "getRequestsList", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            acceptTour : function (id_request)
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/acceptTour/' + service.token + ext,
                        method: service.method,
                        data: $.param({id_request:id_request}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "acceptTour", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        deferred.resolve(true);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "acceptTour", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            declineTour : function (id_request)
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/declineTour/' + service.token + ext,
                        method: service.method,
                        data: $.param({id_request:id_request}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "declineTour", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        deferred.resolve(true);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "declineTour", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            checkout : function (id_request)
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/checkout/' + service.token + ext,
                        method: service.method,
                        data: $.param({id_request:id_request}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "checkout", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        deferred.resolve(true);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "checkout", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            getConfig : function ()
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/getConfig/' + service.token + ext,
                        method: service.method,
                        data: $.param({test:5}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "getConfig", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        deferred.resolve(inReturn.data);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "getConfig", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            toggleLastMinute : function ()
            {
                var deferred = $q.defer();
                $timeout(function ()
                {
                    $http({
                        url: host + '/toggleLastMinute/' + service.token + ext,
                        method: service.method,
                        data: $.param({test:5}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response)
                    {
                        $log.debug(TAG, "toggleLastMinute", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1)
                        {
                            deferred.reject(inReturn.msg);
                            return;
                        }
                        deferred.resolve(inReturn.data.lastminute);
                    },
                            function (error)
                            {
                                $log.debug(TAG, "toggleLastMinute", "error", error);
                                deferred.reject(error.statusText);
                            });
                }, timeoutLong);
                return deferred.promise;
            },
            updateLocalSettings: function (settings)
            {
                $rootScope.settings = settings;
                localStorageService.set('settings', $rootScope.settings);
                if (!!$rootScope.settings.language)
                {
                    $translate.use($rootScope.settings.language);
                    moment.locale($rootScope.settings.language);
                    $mdDateLocale.months = moment.months();
                    $mdDateLocale.shortMonths = moment.monthsShort();
                    $mdDateLocale.days = moment.weekdays();
                    $mdDateLocale.shortDays = moment.weekdaysMin();
                }
            }
        };
        service.setToken = function (data)
        {
            service.token = data;
            localStorageService.set('appToken', data);
        };
        service.setCredentials = SetCredentials;
        service.updateCredentials = updateCredentials;
        service.ClearCredentials = ClearCredentials;
        service.isAuthorized = isAuthorized;
        service.isAuthenticated = isAuthenticated;
        service.setPushId = setPushId;
        service.getPushId = getPushId;
        service.setChannels = setChannels;
        service.getChannels = getChannels;
        service.updateChannels = updateChannels;
        service.cleanPushChannels = cleanPushChannels;
        
        if (APP_CONSTANTS.localDev)
        {
            service.method = 'GET';
        }
        return service;

        



        function SetCredentials(email, password, data)
        {
            var authdata = btoa(email + ':' + password);
            var role = $rootScope.globals.currentUser.role;
            delete data.success;
            delete data.token;
            $rootScope.globals = {
                currentUser: data
            };

            $rootScope.globals.currentUser.authdata = authdata;
            $rootScope.globals.currentUser.role = role;

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            localStorageService.set('globals', $rootScope.globals);
            service.updateChannels();
        }


        function updateCredentials(data)
        {
            var authdata = $rootScope.globals.currentUser.authdata;
            var role = $rootScope.globals.currentUser.role;
            delete data.success;
            delete data.token;
            $rootScope.globals = {
                currentUser: data
            };
            $rootScope.globals.currentUser.authdata = authdata;
            $rootScope.globals.currentUser.role = role;
            localStorageService.set('globals', $rootScope.globals);
                service.updateChannels();
        }

        function ClearCredentials()
        {
            $rootScope.globals = {
                currentUser: {
                    role: USER_ROLES.guest
                }
            };
            $rootScope.settings = {
                language: "en"
            };
            service.token = null;
            localStorageService.remove('globals');
            localStorageService.remove('appToken');
            localStorageService.remove('settings');
            $http.defaults.headers.common.Authorization = 'Basic';
        }

        function isAuthorized(roles)
        {
            var toReturn = false;
            for (var key in roles)
            {
                if (roles[key] === USER_ROLES.all || roles[key] === $rootScope.globals.currentUser.role)
                {
                    toReturn = true;
                }
            }
            return toReturn;
        }

        function isAuthenticated()
        {
            var toReturn = true;
            if (!$rootScope.globals.currentUser.authdata)
            {
                toReturn = false;
            }
            return toReturn;

        }

        function getPushId()
        {
            return localStorageService.get('pushId') || false;
        }


        function setPushId(id)
        {
            localStorageService.set('pushId', id);
        }
        function setChannels(channels)
        {
            localStorageService.set('channels', channels);
        }
        function getChannels()
        {
            return localStorageService.get('channels');
        }

        function updateChannels()
        {
            var channels = [];
            var pushId = service.getPushId();
            if (!pushId)
            {
                return;
            }
            $rootScope.pubnub.mobile_gw_provision({
                device_id: pushId,
                op: 'add',
                gw_type: $rootScope.tipogateway,
                channel: 'user_' + $rootScope.globals.currentUser.user_id,
                callback: function (data)
                {
                    $log.debug("success: " + JSON.stringify(data));
                },
                error: function (data)
                {
                    $log.error("error: " + JSON.stringify(data));
                }
            });
            channels.push('user_' + $rootScope.globals.currentUser.user_id);
            service.setChannels(channels);
        }

        function cleanPushChannels()
        {
            var pushId = service.getPushId();
            if (!pushId)
            {
                return;
            }
            $http({
                cache: false,
                method: 'GET',
                url: 'http://pubsub.pubnub.com/v1/push/sub-key/' + PUSH.pubnubSUB + '/devices/' + pushId + '?type=' + $rootScope.tipogateway
            }).then(function (response)
            {
                $log.debug("channelsPubNub: " + JSON.stringify(response.data));
                var channelsPubNub = response.data;
                for (var key in channelsPubNub)
                {
                    if (channelsPubNub[key] === 'all')
                    {
                        continue;
                    }
                    $rootScope.pubnub.mobile_gw_provision({
                        device_id: pushId,
                        op: 'remove',
                        gw_type: $rootScope.tipogateway,
                        channel: channelsPubNub[key],
                        callback: function (data)
                        {
                            $log.debug("success: " + JSON.stringify(data));
                        },
                        error: function (data)
                        {
                            $log.error("error: " + JSON.stringify(data));
                        }
                    });
                }
                localStorageService.remove('channels');
            }, function (response)
            {
                $log.error("error: " + response);
            });
        }
    }
});


define('app-filters/range.filter',['app'], function(app) {
	
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


define('guide/agenda/guide.agenda.controller',[
    'app',
    'moment'
], function (app, moment)
{

    app.controller('GuideAgendaController', GuideAgendaController);

    GuideAgendaController.$inject = ['$rootScope', '$scope', '$location', '$log', '$compile', '$timeout', '$mdDialog', 'AuthenticationService', 'USER_ROLES', 'PUSH'];

    function GuideAgendaController($rootScope, $scope, $location, $log, $compile, $timeout, $mdDialog, AuthenticationService, USER_ROLES, PUSH)
    {
        var TAG = "GuideAgendaController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = true;
        $scope.$parent.menu.backPath = "";
        $scope.$parent.menu.disableRequest = false;
        $scope.$parent.menu.title = "Agenda";

        vm.colors = {
            meetingInRome: '#fdbf2d',
            other: '#604b7a',
            available: '#1aaf54',
            notAvailable: '#fc0d1b'
        };
        vm.events = [];
        
        
        AuthenticationService.getConfig().then(function(response){
            for(var key in response)
            {
                if(response[key].param_name === "SOS_NUMBER")
                {
                    $scope.$parent.menu.SOSnumber = "tel:"+response[key].param_value;
                    break;
                }
            }
        });
        function loadEvents()
        {
            AuthenticationService.getEventsList().then(function (response)
            {
                vm.events = [];
                for (var key in response)
                {
                    var dateStart = moment(response[key].data_tour + " " + response[key].ora_inizio, "YYYY-MM-DD HH:mm:ss");
                    var dateEnd = moment(response[key].data_tour + " " + response[key].ora_inizio, "YYYY-MM-DD HH:mm:ss").add(response[key].durata, 'hours');
                    var event = {
                        id: response[key].id,
                        start: dateStart.toDate(),
                        end: dateEnd.toDate(),
                        color: vm.colors.other,
                        title: response[key].titolo,
                        textColor: 'transparent'
                    };
                    vm.events.push(event);
                }
                vm.addRemoveEventSource(vm.eventSources, vm.eventsF);
            }, function (error)
            {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(error)
                        .ariaLabel('Error')
                        .ok('Ok')
                        );
            });
        }
        /* event source that calls a function on every view switch */
        vm.eventsF = function (start, end, timezone, callback)
        {
            callback(vm.events);
        };

        /* alert on eventClick */
        vm.alertOnEventClick = function (date, jsEvent, view)
        {
            $location.path('/guide/agenda/events/' + date.id);
        };
        /* Change View */
        vm.changeView = function (view, calendar)
        {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        vm.renderCalendar = function (calendar)
        {
            $timeout(function ()
            {
                if (uiCalendarConfig.calendars[calendar])
                {
                    // uiCalendarConfig.calendars[calendar].fullCalendar();
                    uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
            }, 10);
        };
        /* config object */
        vm.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                defaultView: 'agendaWeek',
                header: {
                    left: 'title',
                    right: '',
                    center: 'agendaWeek today prev,next'
                },
                minTime: '07:00:00',
                maxTime: '24:00:00',
                eventClick: vm.alertOnEventClick
            }
        };


        /* event sources array*/
        vm.eventSources = [vm.events];
        vm.addRemoveEventSource = function (sources, source)
        {
            var canAdd = 0;
            angular.forEach(sources, function (value, key)
            {
                if (sources[key] === source)
                {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0)
            {
                sources.push(source);
            }
        };
        loadEvents();
        
        var offNewNotification = $scope.$on(PUSH.newNotification, function() {
           loadEvents(); 
        });
        
        $scope.$on('$destroy', function ()
        {
            offNewNotification();
        });
    }
});


define('guide/agenda/event/guide.agenda.event.controller',[
    'app',
    'moment'
], function (app, moment)
{

    app.controller('GuideAgendaEventController', GuideAgendaEventController);

    GuideAgendaEventController.$inject = ['$routeParams', '$rootScope', '$scope', '$location', '$log', '$mdDialog', 'AuthenticationService', 'USER_ROLES', 'event'];

    function GuideAgendaEventController($routeParams, $rootScope, $scope, $location, $log, $mdDialog, AuthenticationService, USER_ROLES, event)
    {
        var TAG = "GuideAgendaEventController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = true;
        $scope.$parent.menu.backPath = "";
        $scope.$parent.menu.disableRequest = true;
        $scope.$parent.menu.title = "Tour";

        vm.disableCheckout = false;
        var dataTour = moment(event.data_tour + " " + event.ora_inizio, "YYYY-MM-DD HH:mm:ss");
        if(dataTour.isSameOrAfter(moment()))
        {
            vm.disableCheckout = true;
        }
        vm.event = event;
        vm.colors = {
            meetingInRome: '#fdbf2d',
            other: '#604b7a',
            available: '#1aaf54',
            notAvailable: '#fc0d1b'
        };

        vm.acceptTour = function (ev)
        {
            AuthenticationService.acceptTour(vm.event.id_request).then(function (response)
            {
                vm.event.stato = "3";
            }, function (error)
            {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(error)
                        .ariaLabel('Error')
                        .ok('Ok')
                        .targetEvent(ev)
                        );
            });
        };


        vm.declineTour = function (ev)
        {
            AuthenticationService.declineTour(vm.event.id_request).then(function (response)
            {
                $scope.$parent.menu.historyBack();
            }, function (error)
            {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(error)
                        .ariaLabel('Error')
                        .ok('Ok')
                        .targetEvent(ev)
                        );
            });
        };
        vm.checkout = function (ev)
        {
            var ref = cordova.InAppBrowser.open(encodeURI(vm.event.checkout), '_system', '');
            ref.addEventListener('exit', function(params){
                AuthenticationService.getEvent($routeParams.id).then(function (event)
                {
                    vm.event = event;
                });
            });
//            return;
//            AuthenticationService.checkout(vm.event.id_request).then(function (response)
//            {
//                $scope.$parent.menu.historyBack();
//            }, function (error)
//            {
//                $mdDialog.show(
//                        $mdDialog.alert()
//                        .parent(angular.element(document.querySelector('#popupContainer')))
//                        .clickOutsideToClose(true)
//                        .title('Error')
//                        .textContent(error)
//                        .ariaLabel('Error')
//                        .ok('Ok')
//                        .targetEvent(ev)
//                        );
//            });
        };
        vm.vouchers = function(url){
            var ref = cordova.InAppBrowser.open(encodeURI(url), '_system', '');
        };
        
        vm.voucherCount = function(type){
            var toReturn = 1;
            if(type === "documents_file")
            {
                if(vm.event.voucher)
                {
                    toReturn++;
                }
            } else if(type === "documents_file2")
            {
                if(vm.event.voucher)
                {
                    toReturn++;
                }
                if(vm.event.documents_file)
                {
                    toReturn++;
                }
            } else if(type === "documents_file3")
            {
                if(vm.event.voucher)
                {
                    toReturn++;
                }
                if(vm.event.documents_file)
                {
                    toReturn++;
                }
                if(vm.event.documents_file2)
                {
                    toReturn++;
                }
            } else if(type === "documents_file4")
            {
                if(vm.event.voucher)
                {
                    toReturn++;
                }
                if(vm.event.documents_file)
                {
                    toReturn++;
                }
                if(vm.event.documents_file2)
                {
                    toReturn++;
                }
                if(vm.event.documents_file3)
                {
                    toReturn++;
                }
            }
            return toReturn;
        };
    }
});


define('guide/agenda/events/guide.agenda.events.controller',[
    'app',
    'moment'
], function (app, moment)
{

    app.controller('GuideAgendaEventsController', GuideAgendaEventsController);

    GuideAgendaEventsController.$inject = ['$rootScope', '$scope', '$location', '$log', '$mdDialog', 'AuthenticationService', 'USER_ROLES', 'PUSH', 'events'];

    function GuideAgendaEventsController($rootScope, $scope, $location, $log, $mdDialog, AuthenticationService, USER_ROLES, PUSH, events)
    {
        var TAG = "GuideAgendaEventsController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = false;
        $scope.$parent.menu.backPath = "";
        $scope.$parent.menu.disableRequest = false;
        $scope.$parent.menu.title = "Hello "+ $rootScope.globals.currentUser.nome ;
        vm.events = [];
        for (var key in events)
        {
            if (events[key].stato_richiesta === "4" || events[key].stato_richiesta === "6")
            {
                continue;
            }
            vm.events.push(events[key]);
        }
        vm.colors = {
            meetingInRome: '#fdbf2d',
            other: '#604b7a',
            available: '#1aaf54',
            notAvailable: '#fc0d1b'
        };

        vm.acceptTour = function (ev, id_richiesta)
        {
            AuthenticationService.acceptTour(id_richiesta).then(function (response)
            {
                for (var key in vm.events)
                {
                    if (vm.events[key].id_richiesta === id_richiesta)
                    {
                        vm.events[key].stato_richiesta = "3";
                        break;
                    }
                }
            }, function (error)
            {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(error)
                        .ariaLabel('Error')
                        .ok('Ok')
                        .targetEvent(ev)
                        );
            });
        };


        vm.declineTour = function (ev, id_richiesta)
        {
            AuthenticationService.declineTour(id_richiesta).then(function (response)
            {
                for (var key in vm.events)
                {
                    if (vm.events[key].id_richiesta === id_richiesta)
                    {
                        vm.events.splice(key, 1);
                        break;
                    }
                }
            }, function (error)
            {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(error)
                        .ariaLabel('Error')
                        .ok('Ok')
                        .targetEvent(ev)
                        );
            });
        };

        function loadEvents()
        {
            AuthenticationService.getRequestsList().then(function (events)
            {
                vm.events = [];
                for (var key in events)
                {
                    if (events[key].stato_richiesta === "4" || events[key].stato_richiesta === "6")
                    {
                        continue;
                    }
                    vm.events.push(events[key]);
                }
            });
        }

        var offNewNotification = $scope.$on(PUSH.newNotification, function ()
        {
            loadEvents();
        });

        $scope.convertDate = function(strDate) {
            return (moment(strDate).format('DD/MM/YYYY'));
        }

        $scope.convertTime = function(strTime) {
            return (moment(strTime, ["HH:mm:ss"]).format("hh:mm A"));
        }

        $scope.$on('$destroy', function ()
        {
            offNewNotification();
        });
    }
});


define('guide/home/guide.home.controller',['app'], function (app)
{

    app.controller('GuideHomeController', GuideHomeController);

    GuideHomeController.$inject = ['$rootScope', '$scope', '$location', '$log', 'AuthenticationService', 'USER_ROLES'];

    function GuideHomeController($rootScope, $scope, $location, $log, AuthenticationService, USER_ROLES)
    {
        var TAG = "GuideHomeController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = false;
        $scope.$parent.menu.backPath = "";
    }
});


define('login/login.controller',['app'], function (app)
{

    app.controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$scope', '$location', '$log', 'AuthenticationService', 'USER_ROLES'];

    function LoginController($rootScope, $scope, $location, $log, AuthenticationService, USER_ROLES)
    {
        var TAG = "LoginController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = false;
        $scope.$parent.menu.backPath = "";


        (function initController()
        {
            AuthenticationService.ClearCredentials();
        })();

        vm.login = function(username, password)
        {
            $log.debug(TAG, "login");
            delete vm.error;
            vm.isLoading = true;
            AuthenticationService.login(username, password).then(
                    function (response)
                    {
                        delete vm.isLoading;
                        $location.path('/');
                    },
                    function (error)
                    {
                        delete vm.isLoading;
                        vm.error = error;
                    });
        }
    }
});


define('app-constants/push.constants',['app'], function (app) {
    
    app.constant('PUSH', {
        pubnubPUB: 'pub-c-f6e5b6d7-9120-48d8-ba67-09fb812dee76',
        pubnubSUB: 'sub-c-4318fd7c-df04-11e5-9afa-0619f8945a4f',
        newNotification: 'new-notification',
        gcmSender: '712162072540'
    });
    
});
/* global PushNotification, device */



define('menu/menu.controller',[
    'jquery',
    'app',
    'app-constants/push.constants'
], function (jQuery, app)
{

    app.controller('MenuController', MenuController);

    MenuController.$inject = ['$q', '$route', '$http', '$window', '$rootScope', '$scope', '$location', '$mdSidenav', '$log', '$timeout', '$mdDialog', 'AuthenticationService', 'AUTH_EVENTS', 'PUSH', 'APP_CONSTANTS'];

    function MenuController($q, $route, $http, $window, $rootScope, $scope, $location, $mdSidenav, $log, $timeout, $mdDialog, AuthenticationService, AUTH_EVENTS, PUSH, APP_CONSTANTS)
    {
        var menu = this;
        menu.showHead = true;
        menu.showFooter = true;
        menu.back = false;
        menu.backPath = "";
        menu.disableRequest = false;
        menu.historyBack = historyBack;
        menu.goBack = goBack;
        menu.close = Close;
        menu.open = Open;
        menu.onSwipeLeft = onSwipeLeft;
        menu.toggle = Toggle;
        menu.logout = Logout;
        menu.go = Go;
        menu.title = "";
        menu.SOSnumber = '';
        $scope.$on(AUTH_EVENTS.notAuthenticated, Logout);
        $scope.menu = menu;
        menu.disabletoggleLastMinute = false;
        menu.toggleLastMinute = function()
        {
            menu.disabletoggleLastMinute = true;
            AuthenticationService.toggleLastMinute().then(function(response){
                $rootScope.globals.currentUser.lastminute = response;
                menu.disabletoggleLastMinute = false;
            }, function() {
                menu.disabletoggleLastMinute = false;
            });
        };
        function historyBack()
        {
            $window.history.back();
        }
        function goBack()
        {
            $location.path(menu.backPath);
            //menu.back = false;
        }
        function Close()
        {
            $mdSidenav('left').close();
        }

        function Open()
        {
            $mdSidenav('left').open();
        }

        function onSwipeLeft(ev)
        {
            $mdSidenav('left').toggle();
        }

        function Toggle()
        {
            $mdSidenav('left').toggle();
        }

        function Logout()
        {
            if (AuthenticationService.isAuthenticated())
            {
                AuthenticationService.ClearCredentials();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            }
            AuthenticationService.cleanPushChannels();
            $location.path('/login');
        }

        function Go(path)
        {
            $location.path(path);
            $mdSidenav('left').close();
        }
        document.addEventListener("deviceready", onDeviceReady, false);
//        if (APP_CONSTANTS.localPush)
//        {
//            window.PushNotification = {
//                init: function ()
//                {
//                    return this;
//                },
//                on: function (event, callback)
//                {
//                    document.addEventListener(event, function (data)
//                    {
//                        callback(data.detail);
//                    }, false);
//                    $log.debug('Instanziato listener per: ' + event);
//                }
//            };
//
//        }
//        if (!window.cordova)
//        {
//            navigator.splashscreen = {
//                hide: function ()
//                {}
//            };
//            var event = new Event('deviceready');
//            document.dispatchEvent(event);
//
//        }
        function onDeviceReady()
        {

            document.removeEventListener('deviceready', onDeviceReady, false);
            document.addEventListener('backbutton', onBackKeyDown, false);
            document.addEventListener('resume', function(){
                setTimeout(function() {
                    // $rootScope.PushNotification.setApplicationIconBadgeNumber(function() {
                    //     console.log('success');
                    // }, function() {
                    //     console.log('error');
                    // }, 0);
                }, 0);
            
            }, false);
            //document.addEventListener('menubutton', onMenuKeyDown, false);
            $rootScope.tipogateway = 'apns';
            if (!APP_CONSTANTS.localPush)
            {
                if (device.platform === "Android")
                {
                    $rootScope.tipogateway = 'gcm';
                }
            }
            $timeout(function ()
            {
                navigator.splashscreen.hide();
            }, 1000);

            // var pubnub = PUBNUB({
            //     publish_key: PUSH.pubnubPUB,
            //     subscribe_key: PUSH.pubnubSUB
            // });
            // $rootScope.pubnub = pubnub;
            // var push = PushNotification.init({
            //     "android": {"senderID": PUSH.gcmSender, "sound": true, "vibrate": true, "clearNotifications": true},
            //     "ios": {"alert": true, "badge": true, "sound": true, "clearBadge": true},
            //     "windows": {}
            // });
            // $rootScope.PushNotification = push;
            // push.setApplicationIconBadgeNumber(function() {
            //     console.log('success');
            // }, function() {
            //     console.log('error');
            // }, 0);
            // push.on('registration', function (data)
            // {
            //     $log.debug("Registered on notifications", data.registrationId);

            //     pubnub.mobile_gw_provision({
            //         device_id: data.registrationId,
            //         op: 'add',
            //         gw_type: $rootScope.tipogateway,
            //         channel: 'all',
            //         callback: function (data)
            //         {
            //             $log.debug("success: " + JSON.stringify(data));
            //         },
            //         error: function (data)
            //         {
            //             $log.error("error: " + JSON.stringify(data));
            //         }
            //     });
            //     var pushId = AuthenticationService.getPushId() || data.registrationId;
            //     var channels = AuthenticationService.getChannels() || [];
            //     $log.debug("channels: " + JSON.stringify(channels));
            //     $http({
            //         cache: false,
            //         method: 'GET',
            //         url: 'http://pubsub.pubnub.com/v1/push/sub-key/' + PUSH.pubnubSUB + '/devices/' + pushId + '?type=' + $rootScope.tipogateway
            //     }).then(function (response)
            //     {
            //         $log.debug("channelsPubNub: " + JSON.stringify(response.data));
            //         var channelsPubNub = response.data;
            //         for (var key in channelsPubNub)
            //         {
            //             if (pushId === data.registrationId)
            //             {
            //                 if (channelsPubNub[key] === 'all')
            //                 {
            //                     continue;
            //                 }
            //                 var tocontinue = false;
            //                 for (var key2 in channels)
            //                 {
            //                     if (channelsPubNub[key] === channels[key2])
            //                     {
            //                         tocontinue = true;
            //                         break;
            //                     }

            //                 }
            //                 if (tocontinue)
            //                 {
            //                     continue;
            //                 }
            //             }
            //             pubnub.mobile_gw_provision({
            //                 device_id: pushId,
            //                 op: 'remove',
            //                 gw_type: $rootScope.tipogateway,
            //                 channel: channelsPubNub[key],
            //                 callback: function (data)
            //                 {
            //                     $log.debug("success: " + JSON.stringify(data));
            //                 },
            //                 error: function (data)
            //                 {
            //                     $log.error("error: " + JSON.stringify(data));
            //                 }
            //             });
            //         }
            //     }, function (response)
            //     {
            //         $log.error("error: " + response);
            //     });

            //     AuthenticationService.setPushId(data.registrationId);
            // });

            // push.on('notification', function (data)
            // {
            //     $log.debug(data);
            //     $log.debug("data", JSON.stringify(data));
            //     $log.debug("data.message: ", data.message);
            //     $log.debug("data.title: ", data.title);
            //     $log.debug("data.count: ", data.count);
            //     $log.debug("data.sound: ", data.sound);
            //     $log.debug("data.image: ", data.image);
            //     $log.debug("data.additionalData: " + JSON.stringify(data.additionalData));

            //     if (!!data.additionalData && data.additionalData.html)
            //     {
            //         $rootScope.$apply(function ()
            //         {
            //             $rootScope.$broadcast(PUSH.newNotification);
            //             DialogController.$inject = ['$scope', '$mdDialog'];
            //             function DialogController($scope, $mdDialog)
            //             {
            //                 $scope.openRequest = function (id)
            //                 {
            //                     $location.path('/guide/agenda/events/' + id);
            //                     $mdDialog.hide();
            //                 };
            //                 $scope.hide = function ()
            //                 {
            //                     $mdDialog.hide();
            //                 };
            //                 $scope.cancel = function ()
            //                 {
            //                     $mdDialog.cancel();
            //                 };
            //                 $scope.answer = function (answer)
            //                 {
            //                     $mdDialog.hide(answer);
            //                 };
            //             }
            //             $mdDialog.show({
            //                 controller: DialogController,
            //                 template: atob(data.additionalData.html),
            //                 parent: angular.element(document.body),
            //                 clickOutsideToClose: false
            //             });
            //         });
            //     }

            //     push.finish(function ()
            //     {
            //         $log.debug("processing of push data is finished");
            //     });
            // });

            // push.on('error', function (e)
            // {
            //     $log.error("e.message: " + e.message);
            // });

        }
        $scope.$on('$destroy', function ()
        {
            document.removeEventListener('backbutton', onBackKeyDown, false);
            document.removeEventListener('menubutton', onMenuKeyDown, false);
        });
        function exitApp(buttonIndex)
        {
            if (buttonIndex == 1)
            {
                navigator.app.exitApp();
            }
        }
        function onBackKeyDown()
        {
            //$log.debug($route.current.$$route.originalPath);
            $mdDialog.cancel().then(function (response)
            {
                //console.log('response',response);
            }, function (error)
            {
                //console.log('error',error);
            });
            if ($mdSidenav('left').isOpen())
            {
                $mdSidenav('left').close();
            } else if (jQuery.inArray($location.path(), ['/guide', '/login', '/guide/agenda/events']) !== -1)
            {
                navigator.notification.confirm(
                        'Sei sicuro di voler uscire dall\'applicazione?', // message
                        exitApp, // callback to invoke with index of button pressed
                        'Esci', // title
                        ['Si', 'No']     // buttonLabels
                        );
            } else if (menu.backPath !== "")
            {
                $rootScope.$apply(function ()
                {
                    $location.path(menu.backPath);
                });
            } else
            {
                $window.history.back();
            }
        }

        function onMenuKeyDown()
        {
            if (jQuery.inArray($location.path(), ['/', '/calendar', '/notifications', '/ranking', '/settings']) !== -1)
            {
                $rootScope.$apply(function ()
                {
                    $mdSidenav('left').toggle();
                });
            }
        }
    }
});


define('load',[
    'config',
    'run',
    'app-directives/infinitescroll.directive',
    'app-directives/resolveloader.directive',
    'app-factories/cache.factory',
    'app-services/authentication.service',
    'app-filters/range.filter',
    'guide/agenda/guide.agenda.controller',
    'guide/agenda/event/guide.agenda.event.controller',
    'guide/agenda/events/guide.agenda.events.controller',
    'guide/home/guide.home.controller',
    'login/login.controller',
    'menu/menu.controller'
], function ()
{
});
 // jshint ignore:line
var less = {env: 'development'};
// RequireJS configuration
require.config({// jshint ignore:line
    baseUrl: 'app',
    waitSeconds: 200,
    paths: {
        'less': '../bower_components/less/dist/less',
        'jquery': '../bower_components/jquery/dist/jquery',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        angular: '../bower_components/angular/angular',
        angularRoute: '../bower_components/angular-route/angular-route',
        angularResource: '../bower_components/angular-resource/angular-resource',
        angularLocalStorage: '../bower_components/angular-local-storage/dist/angular-local-storage',
        'ngAnimate': '../bower_components/angular-animate/angular-animate',
        'ngAria': '../bower_components/angular-aria/angular-aria',
        'ngMessages': '../bower_components/angular-messages/angular-messages',
        'ngMaterial': '../bower_components/angular-material/angular-material',
        angularTranslate: '../bower_components/angular-translate/angular-translate',
        'angularTranslateLoaderStaticFiles': '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files',
        'moment': '../bower_components/moment/min/moment-with-locales',
        'googleMaps': 'https://maps.googleapis.com/maps/api/js?libraries=places&language=it',
        'googleMapsen': 'https://maps.googleapis.com/maps/api/js?libraries=places&language=en',
        'PUBNUB': '../bower_components/pubnub/web/pubnub.min',
        'timepicker': '../bower_components/jt.timepicker/jquery.timepicker.min',
        'ui.calendar' : '../bower_components/angular-ui-calendar/src/calendar',
        'fullcalendar':'../bower_components/fullcalendar/dist/fullcalendar.min',
        'gcal':'../bower_components/fullcalendar/dist/gcal'
    },
    shim: {
        'less': {'exports': 'less'},
        'timepicker': ['jquery'],
        'angular': {'exports': 'angular', deps: ['jquery']},
        'angularRoute': ['angular'],
        'angularResource': ['angular'],
        'angularLocalStorage': ['angular'],
        'angularTranslate': ['angular'],
        'angularTranslateLoaderStaticFiles': ['angularTranslate'],
        'ngMessages': ['angular'],
        'ngAnimate': ['angular'],
        'ngAria': ['angular'],
        'ngMaterial': {
            deps: ['ngMessages', 'ngAnimate', 'ngAria']
        },
        'ui.calendar': ['angular'],
        'fullcalendar': ['ui.calendar'],
        'gcal': ['fullcalendar'],
        'jquery': ['less'],
        'bootstrap': ['jquery']
    }
});


/*
 *	Because I use RequireJS I need control over the initialization process
 *	I use a manual bootstrapping method
 *	https://docs.angularjs.org/guide/bootstrap#deferred-bootstrap
 */
window.name = "NG_DEFER_BOOTSTRAP!";

/*
 *	App initialization
 */
require([// jshint ignore:line
    'less',
    'angular',
    'app',
    'load',
    'PUBNUB',
    'timepicker',
    'gcal'
], function (less, angular, app)
{
    less.watch();
    angular.element(document).ready(function ()
    {
        /*
         *	Manual initialization
         *	https://docs.angularjs.org/guide/bootstrap#deferred-bootstrap
         */
        angular.resumeBootstrap([app['name']]); // jshint ignore:line
    });
});
define("mainlocal", function(){});

