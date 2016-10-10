'use strict';

define([
    'app',
    'moment'
], function (app, moment)
{

    app.controller('GuideAgendaEventController', GuideAgendaEventController);

    GuideAgendaEventController.$inject = ['$routeParams', '$rootScope', '$scope', '$location', '$log', '$mdDialog', 'AuthenticationService', 'USER_ROLES', 'event'];

    function GuideAgendaEventController($routeParams, $rootScope, $scope, $location, $log, $mdDialog, AuthenticationService, USER_ROLES, event)
    {
        var TAG = "GuideAgendaEventController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = true;
        $scope.$parent.menu.backPath = "";
        $scope.$parent.menu.disableRequest = true;
        $scope.$parent.menu.title = "Tour";

        vm.disableCheckout = false;
        var dataTour = moment(event.data_tour + " " + event.ora_inizio, "YYYY-MM-DD HH:mm:ss");
        // if(dataTour.isSameOrAfter(moment()))
        if(dataTour.diff(moment())>=0)
        {
            vm.disableCheckout = true;
        }
        vm.event = event;
        vm.colors = {
            meetingInRome: '#fdbf2d',
            other: '#604b7a',
            available: '#1aaf54',
            notAvailable: '#fc0d1b'
        };

        // console.log(event);

        vm.acceptTour = function (ev)
        {
            AuthenticationService.acceptTour(vm.event.id_request).then(function (response)
            {
                vm.event.stato = "3";
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


        vm.declineTour = function (ev)
        {
            AuthenticationService.declineTour(vm.event.id_request).then(function (response)
            {
                $scope.$parent.menu.historyBack();
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

        vm.convertDate = function(strDate) {
            return (moment(strDate).format('DD/MM/YYYY'));
        }

        vm.convertTime = function(strTime) {
            return (moment(strTime, ["HH:mm:ss"]).format("hh:mm A"));
        }

        vm.convertString = function(convflag) {
            if (convflag === '0') {
                return "No   ";
            };
            return "Yes   ";
        }

        vm.checkout = function (ev)
        {
            var ref = cordova.InAppBrowser.open(encodeURI(vm.event.checkout), '_system', '');
            ref.addEventListener('exit', function(params){
                AuthenticationService.getEvent($routeParams.id).then(function (event)
                {
                    vm.event = event;
                });
            });
//            return;
//            AuthenticationService.checkout(vm.event.id_request).then(function (response)
//            {
//                $scope.$parent.menu.historyBack();
//            }, function (error)
//            {
//                $mdDialog.show(
//                        $mdDialog.alert()
//                        .parent(angular.element(document.querySelector('#popupContainer')))
//                        .clickOutsideToClose(true)
//                        .title('Error')
//                        .textContent(error)
//                        .ariaLabel('Error')
//                        .ok('Ok')
//                        .targetEvent(ev)
//                        );
//            });
        };
        vm.vouchers = function(url){
            var ref = cordova.InAppBrowser.open(encodeURI(url), '_system', '');
        };
        
        vm.voucherCount = function(type){
            var toReturn = 1;
            if(type === "documents_file")
            {
                if(vm.event.voucher)
                {
                    toReturn++;
                }
            } else if(type === "documents_file2")
            {
                if(vm.event.voucher)
                {
                    toReturn++;
                }
                if(vm.event.documents_file)
                {
                    toReturn++;
                }
            } else if(type === "documents_file3")
            {
                if(vm.event.voucher)
                {
                    toReturn++;
                }
                if(vm.event.documents_file)
                {
                    toReturn++;
                }
                if(vm.event.documents_file2)
                {
                    toReturn++;
                }
            } else if(type === "documents_file4")
            {
                if(vm.event.voucher)
                {
                    toReturn++;
                }
                if(vm.event.documents_file)
                {
                    toReturn++;
                }
                if(vm.event.documents_file2)
                {
                    toReturn++;
                }
                if(vm.event.documents_file3)
                {
                    toReturn++;
                }
            }
            return toReturn;
        };
    }
});