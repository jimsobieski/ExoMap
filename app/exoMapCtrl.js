angular.module('myApp.ExoMapCtrl', ['ngRoute']).controller('ExoMapCtrl', function($scope, $mdSidenav, $locale, $http, geolocation) {


    var mymap = L.map('mapid').setView([43.592100, 1.400160], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        zoomAnimation: true,
        fadeAnimation: true,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiamltc29iaWVza2kiLCJhIjoiY2pkYmtqcmJoMXdhMDMzbzI5MmpvdTE0aSJ9.G7SHd5ABI79uOHzj-bOOEA'
    }).addTo(mymap);

    geolocation.getLocation().then(function(data){
        $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
        console.log($scope.coords);
        $scope.loadMap();
    });

    $scope.loadMap = function() {
        //var mymap = L.map('mapid').setView([$scope.coords.lat, $scope.coords.long], 13);


        $scope.marker = L.marker([$scope.coords.lat, $scope.coords.long]).addTo(mymap);
    };


    $scope.toggleSidenav = function() {
        $mdSidenav('left').toggle();
    };

    console.log($locale);

    $http.get('http://localhost:8081/api/stops').then(function(response){
      $scope.stops = response.data;

    });


    $scope.geoSearch = function() {

    };

    $scope.showStops = function () {
        $scope.stopMarkers = [];
        for(var i=0; i< $scope.stops.length; i++) {
            $scope.stopMarkers[i] = L.marker([$scope.stops[i].stop_lat, $scope.stops[i].stop_lon]).addTo(mymap);
           // $scope.stopMarkers[i].bindPopup()
        }

    }





});