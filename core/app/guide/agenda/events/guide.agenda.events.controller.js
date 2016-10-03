'use strict';

define([
    'app',
    'moment'
], function (app, moment)
{

    app.controller('GuideAgendaEventsController', GuideAgendaEventsController);

    GuideAgendaEventsController.$inject = ['$rootScope', '$scope', '$location', '$log', '$mdDialog', 'AuthenticationService', 'USER_ROLES', 'PUSH', 'events'];

    function GuideAgendaEventsController($rootScope, $scope, $location, $log, $mdDialog, AuthenticationService, USER_ROLES, PUSH, events)
    {
        var TAG = "GuideAgendaEventsController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = false;
        $scope.$parent.menu.backPath = "";
        $scope.$parent.menu.disableRequest = false;
        $scope.$parent.menu.title = "Hello "+ $rootScope.globals.currentUser.nome ;
        vm.events = [];
        for (var key in events)
        {
            if (events[key].stato_richiesta === "4" || events[key].stato_richiesta === "6")
            {
                continue;
            }
            vm.events.push(events[key]);
        }
        vm.colors = {
            meetingInRome: '#fdbf2d',
            other: '#604b7a',
            available: '#1aaf54',
            notAvailable: '#fc0d1b'
        };

        vm.acceptTour = function (ev, id_richiesta)
        {
            AuthenticationService.acceptTour(id_richiesta).then(function (response)
            {
                for (var key in vm.events)
                {
                    if (vm.events[key].id_richiesta === id_richiesta)
                    {
                        vm.events[key].stato_richiesta = "3";
                        break;
                    }
                }
            }, function (error)
            {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(error)
                        .ariaLabel('Error')
                        .ok('Ok')
                        .targetEvent(ev)
                        );
            });
        };


        vm.declineTour = function (ev, id_richiesta)
        {
            AuthenticationService.declineTour(id_richiesta).then(function (response)
            {
                for (var key in vm.events)
                {
                    if (vm.events[key].id_richiesta === id_richiesta)
                    {
                        vm.events.splice(key, 1);
                        break;
                    }
                }
            }, function (error)
            {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(error)
                        .ariaLabel('Error')
                        .ok('Ok')
                        .targetEvent(ev)
                        );
            });
        };

        function loadEvents()
        {
            AuthenticationService.getRequestsList().then(function (events)
            {
                vm.events = [];
                for (var key in events)
                {
                    if (events[key].stato_richiesta === "4" || events[key].stato_richiesta === "6")
                    {
                        continue;
                    }
                    vm.events.push(events[key]);
                }
            });
        }

        var offNewNotification = $scope.$on(PUSH.newNotification, function ()
        {
            loadEvents();
        });

        $scope.convertDate = function(strDate) {
            return (moment(strDate).format('DD/MM/YYYY'));
        }

        $scope.convertTime = function(strTime) {
            return (moment(strTime, ["HH:mm:ss"]).format("hh:mm A"));
        }

        $scope.$on('$destroy', function ()
        {
            offNewNotification();
        });
    }
});