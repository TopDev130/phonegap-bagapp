'use strict';

define([
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