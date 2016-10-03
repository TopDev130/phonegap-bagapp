'use strict';

define(['app'], function (app)
{

    app.controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$scope', '$location', '$log', 'AuthenticationService', 'USER_ROLES'];

    function LoginController($rootScope, $scope, $location, $log, AuthenticationService, USER_ROLES)
    {
        var TAG = "LoginController";
        var vm = this;
        $scope.$parent.menu.showHead = false;
        $scope.$parent.menu.showFooter = false;
        $scope.$parent.menu.back = false;
        $scope.$parent.menu.backPath = "";


        (function initController()
        {
            AuthenticationService.ClearCredentials();
        })();

        vm.login = function(username, password)
        {
            $log.debug(TAG, "login");
            delete vm.error;
            vm.isLoading = true;
            AuthenticationService.login(username, password).then(
                    function (response)
                    {
                        delete vm.isLoading;
                        $location.path('/');
                    },
                    function (error)
                    {
                        delete vm.isLoading;
                        vm.error = error;
                    });
        }
    }
});