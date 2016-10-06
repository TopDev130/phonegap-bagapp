'use strict';

define([
    'app',
    'moment'
], function (app, moment)
{

    app.controller('GuideAgendaController', GuideAgendaController);

    GuideAgendaController.$inject = ['$rootScope', '$scope', '$location', '$log', '$compile', '$timeout', '$mdDialog', 'AuthenticationService', 'USER_ROLES', 'PUSH'];

    function GuideAgendaController($rootScope, $scope, $location, $log, $compile, $timeout, $mdDialog, AuthenticationService, USER_ROLES, PUSH)
    {
        var TAG = "GuideAgendaController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = true;
        $scope.$parent.menu.backPath = "";
        $scope.$parent.menu.disableRequest = false;
        $scope.$parent.menu.title = "Agenda";

        vm.colors = {
            meetingInRome: '#fdbf2d',
            other: '#0f5',
            available: '#1aaf54',
            notAvailable: '#fc0d1b'
        };
        vm.events = [];
        
        
        AuthenticationService.getConfig().then(function(response){
            for(var key in response)
            {
                if(response[key].param_name === "SOS_NUMBER")
                {
                    $scope.$parent.menu.SOSnumber = "tel:"+response[key].param_value;
                    break;
                }
            }
        });
        function loadEvents()
        {
            AuthenticationService.getEventsList().then(function (response)
            {
                vm.events = [];
                for (var key in response)
                {
                    var dateStart = moment(response[key].data_tour + " " + response[key].ora_inizio, "YYYY-MM-DD HH:mm:ss");
                    var dateEnd = moment(response[key].data_tour + " " + response[key].ora_inizio, "YYYY-MM-DD HH:mm:ss").add(response[key].durata, 'hours');
                    var event = {
                        id: response[key].id,
                        start: dateStart.toDate(),
                        end: dateEnd.toDate(),
                        color: vm.colors.other,
                        title: response[key].titolo,
                        textColor: 'transparent'
                    };
                    vm.events.push(event);
                }
                //hack
                $(".fc-unthemed").fullCalendar('render');
                
                vm.addRemoveEventSource(vm.eventSources, vm.eventsF);
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
                        );
            });
        }
        /* event source that calls a function on every view switch */
        vm.eventsF = function (start, end, timezone, callback)
        {
            callback(vm.events);
        };

        /* alert on eventClick */
        vm.alertOnEventClick = function (date, jsEvent, view)
        {
            $location.path('/guide/agenda/events/' + date.id);
        };
        /* Change View */
        vm.changeView = function (view, calendar)
        {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        vm.renderCalendar = function (calendar)
        {
            $timeout(function ()
            {
                if (uiCalendarConfig.calendars[calendar])
                {
                    // uiCalendarConfig.calendars[calendar].fullCalendar();
                    uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
            }, 10);
        };
        /* config object */
        vm.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                defaultView: 'agendaWeek',
                header: {
                    left: 'title',
                    right: '',
                    center: 'agendaWeek today prev,next'
                },
                minTime: '07:00:00',
                maxTime: '24:00:00',
                eventClick: vm.alertOnEventClick
            }
        };


        /* event sources array*/
        vm.eventSources = [vm.events];
        vm.addRemoveEventSource = function (sources, source)
        {
            var canAdd = 0;
            angular.forEach(sources, function (value, key)
            {
                if (sources[key] === source)
                {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0)
            {
                sources.push(source);
            }
        };
        loadEvents();
        
        var offNewNotification = $scope.$on(PUSH.newNotification, function() {
           loadEvents(); 
        });
        
        $scope.$on('$destroy', function ()
        {
            offNewNotification();
        });
    }
});