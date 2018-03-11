angular.module('myApp.ExoMapCtrl', ['ngRoute']).controller('ExoMapCtrl',
    function ($scope, $mdSidenav, $base64, $locale, $mdDialog, $location,
              $http, $httpParamSerializer, $localStorage, $sessionStorage, geolocation) {


    var mymap = L.map('mapid').setView([43.592100, 1.400160], 18);

    $scope.goToGeolocalisation = function() {
        geolocation.getLocation().then(function (data) {
            $scope.coords = {lat: data.coords.latitude, long: data.coords.longitude};
            mymap.setView([$scope.coords.lat, $scope.coords.long], 18);
            $scope.markerGeo = L.marker([$scope.coords.lat, $scope.coords.long])
                .bindPopup("Vous êtes ici").openPopup().addTo(mymap);

        });
    };
    $scope.goToGeolocalisation();

    $http.get(' https://master.apis.dev.openstreetmap.org/api/0.6/permissions').then(function(response) {
        //console.log(response.data);
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

        $http.post('http://localhost:8081/api/geosearch', JSON.stringify(data)).then(function (response) {
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

    $scope.getOSMdata = function() {
        var data = $scope.getBoundsMap();
        $http.get('https://api.openstreetmap.org/api/0.6/map?bbox='+data.minLon+','+data.minLat+','+data.maxLon+','+data.maxLat).then(function(response) {
            //OSM DATA
        });
    };
    $scope.getOSMdata();

    $scope.reloadData = function () {
        $scope.getStops();
    };


    $scope.searchStop = function() {
        var data = {searchText: $scope.searchText};
        return $http.post('http://localhost:8081/api/textsearch', JSON.stringify(data)).then(function (response) {
            return response.data;

        });
    };


    $scope.goToStop = function(stop) {
        $scope.clearMarkers();

        mymap.setView([stop.stop_lat, stop.stop_lon], 15);
        $scope.markerStop = L.marker([stop.stop_lat, stop.stop_lon])
            .bindPopup(stop.stop_name).openPopup().addTo(mymap);
    };


    $scope.openLoginModal = function(ev) {
        $mdDialog.show({
            controller: 'loginController',
            controllerAs: 'login',
            templateUrl: 'login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        }).then(function (answer) {

        })
    };

    $scope.clearMarkers = function () {
        if($scope.markerGeo) {
            mymap.removeLayer($scope.markerGeo);
            delete $scope.markerGeo
        }
        if($scope.markerStop) {
            mymap.removeLayer($scope.markerStop);
            delete $scope.markerStop
        }
    };

    $scope.isAuthenticated = function () {
      return $localStorage.token !== undefined;
    };


    $scope.logout = function() {
        var data = {token: $localStorage.token};
        $http.post('http://localhost:8081/api/logout', JSON.stringify(data)).then(function () {
            $location.reload();
        });
        delete $localStorage.token;
    }



    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        minZoom: 3,
        moveend: $scope.reloadData(),
        zoomlevelschange: $scope.reloadData(),
        zoomAnimation: true,
        fadeAnimation: true,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiamltc29iaWVza2kiLCJhIjoiY2pkYmtqcmJoMXdhMDMzbzI5MmpvdTE0aSJ9.G7SHd5ABI79uOHzj-bOOEA'
    }).addTo(mymap);

});