/* global PushNotification, device */

'use strict';

define([
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
            $rootScope.PushNotification.setApplicationIconBadgeNumber(function() {
                console.log('success');
            }, function() {
                console.log('error');
            }, 0);
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

            var pubnub = PUBNUB({
                publish_key: PUSH.pubnubPUB,
                subscribe_key: PUSH.pubnubSUB
            });
            $rootScope.pubnub = pubnub;
            var push = PushNotification.init({
                "android": {"senderID": PUSH.gcmSender, "sound": true, "vibrate": true, "clearNotifications": true},
                "ios": {"alert": true, "badge": true, "sound": true, "clearBadge": true},
                "windows": {}
            });
            $rootScope.PushNotification = push;
            push.setApplicationIconBadgeNumber(function() {
                console.log('success');
            }, function() {
                console.log('error');
            }, 0);
            push.on('registration', function (data)
            {
                $log.debug("Registered on notifications", data.registrationId);

                pubnub.mobile_gw_provision({
                    device_id: data.registrationId,
                    op: 'add',
                    gw_type: $rootScope.tipogateway,
                    channel: 'all',
                    callback: function (data)
                    {
                        $log.debug("success: " + JSON.stringify(data));
                    },
                    error: function (data)
                    {
                        $log.error("error: " + JSON.stringify(data));
                    }
                });
                var pushId = AuthenticationService.getPushId() || data.registrationId;
                var channels = AuthenticationService.getChannels() || [];
                $log.debug("channels: " + JSON.stringify(channels));
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
                        if (pushId === data.registrationId)
                        {
                            if (channelsPubNub[key] === 'all')
                            {
                                continue;
                            }
                            var tocontinue = false;
                            for (var key2 in channels)
                            {
                                if (channelsPubNub[key] === channels[key2])
                                {
                                    tocontinue = true;
                                    break;
                                }

                            }
                            if (tocontinue)
                            {
                                continue;
                            }
                        }
                        pubnub.mobile_gw_provision({
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
                }, function (response)
                {
                    $log.error("error: " + response);
                });

                AuthenticationService.setPushId(data.registrationId);
            });

            push.on('notification', function (data)
            {
                $log.debug(data);
                $log.debug("data", JSON.stringify(data));
                $log.debug("data.message: ", data.message);
                $log.debug("data.title: ", data.title);
                $log.debug("data.count: ", data.count);
                $log.debug("data.sound: ", data.sound);
                $log.debug("data.image: ", data.image);
                $log.debug("data.additionalData: " + JSON.stringify(data.additionalData));

                if (!!data.additionalData && data.additionalData.html)
                {
                    $rootScope.$apply(function ()
                    {
                        $rootScope.$broadcast(PUSH.newNotification);
                        DialogController.$inject = ['$scope', '$mdDialog'];
                        function DialogController($scope, $mdDialog)
                        {
                            $scope.openRequest = function (id)
                            {
                                $location.path('/guide/agenda/events/' + id);
                                $mdDialog.hide();
                            };
                            $scope.hide = function ()
                            {
                                $mdDialog.hide();
                            };
                            $scope.cancel = function ()
                            {
                                $mdDialog.cancel();
                            };
                            $scope.answer = function (answer)
                            {
                                $mdDialog.hide(answer);
                            };
                        }
                        $mdDialog.show({
                            controller: DialogController,
                            template: atob(data.additionalData.html),
                            parent: angular.element(document.body),
                            clickOutsideToClose: false
                        });
                    });
                }

                push.finish(function ()
                {
                    $log.debug("processing of push data is finished");
                });
            });

            push.on('error', function (e)
            {
                $log.error("e.message: " + e.message);
            });

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