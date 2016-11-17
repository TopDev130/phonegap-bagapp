'use strict';

define(['app'], function (app)
{
    app.controller('GuideHomeController', GuideHomeController);

    GuideHomeController.$inject = ['$rootScope', '$scope', '$location', '$log', 'AuthenticationService', 'USER_ROLES'];

    function GuideHomeController($rootScope, $scope, $location, $log, AuthenticationService, USER_ROLES)
    {
        var TAG = "GuideHomeController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = false;
        $scope.$parent.menu.backPath = "";
    }
});