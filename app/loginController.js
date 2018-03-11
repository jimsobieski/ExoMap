angular.module('myApp.loginController', ['ngRoute'])
    .controller('loginController', function ($scope, $http, $localStorage, $sessionStorage, $mdDialog,
                                             $mdToast) {

        $scope.login = '';
        $scope.password = '';

        $scope.signin = function () {
            var formData = {
                login: $scope.login,
                password: $scope.password
            };

            $http.post('http://localhost:8081/api/login', JSON.stringify(formData)).then(function (response) {
                $localStorage.token = response.data.token;
                $mdDialog.hide();
                $mdToast.show($mdToast.simple().textContent('Bienvenue sur ExoMap'));
            })
        };

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
    });