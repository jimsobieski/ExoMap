// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngMaterial',
    'ngRoute',
    'ngAnimate',
    'ngMessages',
    'ngRoute',
    'myApp.MapCtrl',
    'myApp.ExoMapCtrl'
]).config(['$locationProvider', '$routeProvider', '$qProvider', function ($locationProvider, $routeProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);

    $locationProvider.hashPrefix('');

    $routeProvider.when('/', {
        templateUrl: "index.html",
        controller: "ExoMapCtrl"
    }).when('/map', {
        templateUrl: "map/map.html",
        controller: "MapCtrl"
    }).otherwise({redirectTo: '/map'});;

}]);
