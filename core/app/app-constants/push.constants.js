'use strict';

define(['app'], function (app) {
    
    app.constant('PUSH', {
        pubnubPUB: 'pub-c-f6e5b6d7-9120-48d8-ba67-09fb812dee76',
        pubnubSUB: 'sub-c-4318fd7c-df04-11e5-9afa-0619f8945a4f',
        newNotification: 'new-notification',
        gcmSender: '712162072540'
    });
    
});