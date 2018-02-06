angular.module('myApp.ExoMapCtrl', ['ngRoute']).controller('ExoMapCtrl', function($scope, $mdSidenav, $window) {

    $scope.sizeMap = 100;

    $scope.toggleSidenav = function() {
        $mdSidenav('right').toggle();
        changeSizeMap();
    };

    var changeSizeMap = function () {
        console.log($window.innerWidth);
        console.log($mdSidenav);
        if($scope.sizeMap === 100) {
            $scope.sizeMap = 80;
        }
        else {
            $scope.sizeMap = 100;
        }
    }

});