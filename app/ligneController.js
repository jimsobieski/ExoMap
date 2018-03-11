angular.module('myApp.ligneController', ['ngRoute'])
    .controller('ligneController', function ($scope, $http, $localStorage, $sessionStorage, $mdDialog,
                                             $mdToast, ligne, routes) {

        $scope.routes = routes;
        $scope.ligne = ligne;
        $scope.routesLigne= [];
        $scope.getRoutesLigne = function() {

            angular.forEach($scope.routes, function (route, key) {
              if(route.route_short_name === $scope.ligne.name){
                  $scope.routesLigne.push(route);
              }
            });
            return $scope.routesLigne;
        };
        $scope.getRoutesLigne();

        $scope.toggleStopRoutes = function(route){
            if($scope.stopsRoute) {
                delete $scope.stopsRoute
            }
            else {
                $scope.getStopRoutes(route);
            }
        };
        $scope.getStopRoutes = function(route) {
            var data = {route_id: route.route_id};
            $http.post('http://localhost:8081/api/route/stops', JSON.stringify(data)).then(function(response){
                $scope.stopsRoute = response.data[0];
            })
        };

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
    });