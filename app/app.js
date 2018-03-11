// Declare app level module which depends on views, and components
var exomap =angular.module('myApp', [
    'ngMaterial',
    'ngRoute',
    'ngAnimate',
    'ngMessages',
    'ngRoute',
    'geolocation',
    'base64',
    'ngStorage',
    'myApp.loginController',
    'myApp.ExoMapCtrl'
]).config(['$locationProvider', '$routeProvider', '$qProvider', '$httpProvider', function ($locationProvider, $routeProvider, $qProvider, $httpProvider, $http) {
    $qProvider.errorOnUnhandledRejections(false);

    $locationProvider.hashPrefix('');

    $routeProvider.when('/', {
        templateUrl: "index.html",
        controller: "ExoMapCtrl"
    }).when('/map', {
        templateUrl: "map/map.html",
        controller: "MapCtrl"
    }).otherwise({redirectTo: '/map'});

    $httpProvider.interceptors.push(['$q', '$location', '$base64', function ($q, $location, $base64) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                var auth = $base64.encode('jimsobieski:Super-keygen@21o');
                config.headers.Authorization = 'Basic '+auth;
                return config;
            }
        }}]);

}]);
