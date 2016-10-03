'use strict';

define(['app'], function(app) {
    
    app.constant('USER_ROLES', {
        all : '*',
        admin : 'admin',
        guide : 'guida',
        client: 'cliente',
        guest : 'guest'
    });
});