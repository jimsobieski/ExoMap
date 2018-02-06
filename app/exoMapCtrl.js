angular.module('myApp.ExoMapCtrl', ['ngRoute']).controller('ExoMapCtrl', function($scope, $mdSidenav) {


    $scope.toggleSidenav = function() {
        $mdSidenav('left').toggle();
    };
});