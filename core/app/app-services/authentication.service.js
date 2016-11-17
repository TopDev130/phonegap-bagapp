'use strict';

define([
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
            setLockedDate : function (setDate) {
                var deferred = $q.defer();
                $timeout(function() {
                    $http({
                        url: host + '/' + setDate.apiType + '/' + service.token,
                        method: 'GET',
                        data: $.param({startdate:setDate.startDate, enddate:setDate.endDate}),
                        cache: false,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function (response) {
                        $log.debug(TAG, "setLockedDate", "response", response);
                        var inReturn = response.data;
                        if (inReturn.success !== 1) {
                            deferred.reject(inReturn.msg);
                            return;
                        };
                        deferred.resolve(inReturn.data);
                    }, function (error) {
                        $log.debug(TAG, "setLockedDate", "error", error);
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