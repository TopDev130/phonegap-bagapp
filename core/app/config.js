'use strict'; // jshint ignore:line

define([// jshint ignore:line
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