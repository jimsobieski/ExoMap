angular.module('myApp.ExoMapCtrl', ['ngRoute']).controller('ExoMapCtrl', function ($scope, $mdSidenav, $locale, $http, $httpParamSerializer, geolocation) {


    var mymap = L.map('mapid').setView([43.592100, 1.400160], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        minZoom: 3,
        //moveend: $scope.reloadData(),
        //zoomlevelschange: $scope.reloadData(),
        zoomAnimation: true,
        fadeAnimation: true,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiamltc29iaWVza2kiLCJhIjoiY2pkYmtqcmJoMXdhMDMzbzI5MmpvdTE0aSJ9.G7SHd5ABI79uOHzj-bOOEA'
    }).addTo(mymap);

    geolocation.getLocation().then(function (data) {
        $scope.coords = {lat: data.coords.latitude, long: data.coords.longitude};
        mymap.setView([$scope.coords.lat, $scope.coords.long], 12);
        $scope.marker = L.marker([$scope.coords.lat, $scope.coords.long])
            .bindPopup("Vous êtes ici").openPopup().addTo(mymap);

    });

    $scope.getBoundsMap = function () {
        var boundsMap = mymap.getBounds();
        return {
            minLat: boundsMap._southWest.lat,
            maxLat: boundsMap._northEast.lat,
            minLon: boundsMap._southWest.lng,
            maxLon: boundsMap._northEast.lng
        };
    };


    $scope.toggleSidenav = function () {
        $mdSidenav('left').toggle();
    };
    $scope.getStops = function () {
        var data = $scope.getBoundsMap();
        console.log(data);
        $http.post('http://localhost:8081/api/stops', JSON.stringify(data)).then(function (response) {
            $scope.stops = response.data;
        });
    };
    $scope.getStops();

    $scope.showStops = function () {
        $scope.stopMarkers = [];
        for (var i = 0; i < $scope.stops.length; i++) {
            $scope.stopMarkers[i] = L.marker([$scope.stops[i].stop_lat, $scope.stops[i].stop_lon]).addTo(mymap);
        }

    };

    $scope.reloadData = function () {
        $scope.getStops();
    }



});