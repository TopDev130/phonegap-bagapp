({
    appDir: './core',
    baseUrl: './app',
    dir: './www',
    optimizeCss: 'standard',
    //optimizeCss: 'none',
    removeCombined: true,
    fileExclusionRegExp: /^(mainlocal.js|index.less)$/,
    modules: [
        {
            name: "main"
        }
    ],
    paths: {
        cordova: 'empty:',
        'less': 'empty:',
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
        'moment': '../bower_components/moment/min/moment-with-locales',
        angularTranslate: 'empty:',
        'angularTranslateLoaderStaticFiles': 'empty:',
        'googleMaps': 'empty:',
        'timepicker': '../bower_components/jt.timepicker/jquery.timepicker.min',
        'ui.calendar' : 'empty:',
        'fullcalendar':'empty:',
        'gcal':'empty:'
    },
    shim: {
        'cordova': {'exports': 'cordova'},
        'less': {'exports': 'less'},
        'timepicker': ['jquery'],
        'angular': {'exports': 'angular', 'deps': ['cordova', 'jquery']},
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
    },
    //optimize: "none"
})