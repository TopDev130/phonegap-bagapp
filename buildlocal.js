({
    appDir: './core',
    baseUrl: './app',
    dir: './distributionlocal',
    //optimizeCss: 'standard',
    optimizeCss: 'none',
    removeCombined: true,
    fileExclusionRegExp: /^main.js$/,
    modules: [
        {
            name: "mainlocal"
        }
    ],
    paths: {
        less: 'empty:',
        jquery: 'empty:',
        bootstrap: 'empty:',
        angular: 'empty:',
        angularRoute: 'empty:',
        angularResource: 'empty:',
        angularLocalStorage: 'empty:',
        'ngAnimate': 'empty:',
        'ngAria': 'empty:',
        'ngMessages': 'empty:',
        'ngMaterial': 'empty:',
        angularTranslate: 'empty:',
        'angularTranslateLoaderStaticFiles': 'empty:',
        'moment': 'empty:',
        'googleMaps': 'empty:',
        'googleMapsen': 'empty:',
        'PUBNUB': 'empty:',
        'timepicker': 'empty:',
        'ui.calendar' : 'empty:',
        'fullcalendar':'empty:',
        'gcal':'empty:'
    },
    shim: {
        'angular': {'exports': 'angular', deps: ['jquery']},
        'less': {'exports': 'less'},
        'timepicker': ['jquery'],
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
    },
    optimize: "none"
})