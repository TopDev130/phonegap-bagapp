'use strict'; // jshint ignore:line
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