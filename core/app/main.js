'use strict';  // jshint ignore:line

// RequireJS configuration
require.config({// jshint ignore:line
    baseUrl: 'app',
    waitSeconds: 200,
    paths: {
        cordova: '../cordova',
        less: '../bower_components/less/dist/less',
        angularTranslate: '../bower_components/angular-translate/angular-translate',
        'angularTranslateLoaderStaticFiles': '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files',
        'googleMaps': 'https://maps.googleapis.com/maps/api/js?libraries=places&language=it',
        'ui.calendar' : '../bower_components/angular-ui-calendar/src/calendar',
        'fullcalendar':'../bower_components/fullcalendar/dist/fullcalendar.min',
        'gcal':'../bower_components/fullcalendar/dist/gcal'
    },
    shim: {
        'cordova': {'exports': 'cordova'},
        'less': {'exports': 'less'},
        'timepicker': ['jquery'],
        'angular': {'exports': 'angular', 'deps': ['cordova', 'less', 'jquery']},
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
        'jquery': {'deps': ['cordova', 'less']},
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
    'angular',
    'app',
    'load',
    'cordova',
    'less',
    'timepicker',
    'gcal'
], function (angular, app)
{

    var exec = cordova.require('cordova/exec');  // jshint ignore:line
    angular.element(document).ready(function ()
    {
        angular.resumeBootstrap([app['name']]);  // jshint ignore:line
    });
});