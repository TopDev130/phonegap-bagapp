'use strict';

define([
    'app',
    'moment'
], function (app, moment)
{

    app.controller('GuideLockController', GuideLockController);

    GuideLockController.$inject = ['$rootScope', '$scope', '$log', '$compile', '$timeout', '$mdDialog', 'AuthenticationService', 'USER_ROLES', 'PUSH'];

    function GuideLockController($rootScope, $scope, $log, $compile, $timeout, $mdDialog, AuthenticationService, USER_ROLES, PUSH)
    {
        var TAG = "GuideLockController";
        var vm = this;

        vm.dateData = {
            startDate: new Date(),
            endDate: new Date()
        }


        vm.openDate = function(convDate) {
            if (convDate != null) {
                return moment(convDate).format('MM/DD/YYYY');    
            } else {
                return moment().format('MM/DD/YYYY');
            };
        }

        vm.sendDate = function() {
            if (vm.dateData.startDate==null || vm.dateData.endDate==null) {
                alert("Date input error!\nPlease input again!");
                return;
            };
            if (moment(vm.dateData.startDate,"DD/MM/YYYY HH:mm:ss").diff(moment(vm.dateData.endDate,"DD/MM/YYYY HH:mm:ss"))>=0) {
                alert("End date input error!\nPlease input again!");
                return;
            };

            var lockDate = {
                "startDate": moment(vm.dateData.startDate).format('YYYY-MM-DD'),
                "endDate": moment(vm.dateData.endDate).format('YYYY-MM-DD'),
                "apiType": 'setLockedDays'
            }

            console.log(lockDate);

            vm.isLoading=true;

            AuthenticationService.setLockedDate(lockDate).then(
                function (response)
                {
                    delete vm.isLoading;
                    alert('Lock Date Set Successful!');
                },
                function (error)
                {
                    delete vm.isLoading;
                    alert('Lock Date Set failed!\n'+error);
                }
            );

        }
    }
});