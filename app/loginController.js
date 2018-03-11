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

            $http.post('http://localhost:8081/api/login', JSON.stringify(formData)).then(function (response1) {
                console.log($localStorage.token === response1.data.token);
                $localStorage.token = response1.data.token;

                $http.post('http://localhost:8081/api/user', JSON.stringify({token: $localStorage.token})).then(function (response2) {
                    console.log(response2.data);
                    $mdToast.show($mdToast.simple().textContent('Bienvenue sur ExoMap '+$scope.login));
                });
                $mdDialog.hide();
            })
        };

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
    });