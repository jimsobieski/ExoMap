angular.module('myApp.ExoMapCtrl', ['ngRoute']).controller('ExoMapCtrl',
    function ($scope, $mdSidenav, $base64, $locale, $mdDialog, $location,
              $http, $httpParamSerializer, $localStorage, $sessionStorage, geolocation) {

        $scope.zoom = 16;
        var mymap = L.map('mapid').setView([43.592100, 1.400160], $scope.zoom);

        $scope.goToGeolocalisation = function () {
            geolocation.getLocation().then(function (data) {
                $scope.coords = {lat: data.coords.latitude, long: data.coords.longitude};
                console.log($scope.coords);
                mymap.setView([$scope.coords.lat, $scope.coords.long], $scope.zoom);
                $scope.markerGeo = L.circle([$scope.coords.lat, $scope.coords.long], {
                    color: '#1976D2',
                    fillColor: '#64B5F6',
                    fillOpacity: 0.5,
                    radius: 50
                }).bindPopup("Vous êtes ici").openPopup().addTo(mymap);
            });
        };
        $scope.goToGeolocalisation();

        $http.get(' https://master.apis.dev.openstreetmap.org/api/0.6/permissions').then(function (response) {
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

        $scope.getRoutes = function () {
            $http.get('http://localhost:8081/api/routes').then(function (response) {
                $scope.routes = response.data;
            });
        };
        $scope.getRoutes();

        $scope.getLignes = function (ligneType) {
            var tmp = [];

            angular.forEach($scope.routes, function (route, key) {
                var match = false;

                for (var i = 0; i < tmp.length; i++) {

                    if (tmp[i].name === route.route_short_name) {
                        match = true;
                        break;
                    }
                }
                if (!match) {
                    var ligne = {
                        name: route.route_short_name,
                        type: route.route_type,
                        route_url: route.route_url
                    };
                    tmp.push(ligne);
                }


            });
            switch(ligneType) {
                case 1 : $scope.rer = tmp;
                    return $scope.rer;
                case 2 : $scope.trans = tmp;
                    return $scope.trans;
                case 3 : $scope.tram = tmp;
                    return $scope.tram;
                case 4 : $scope.bus = tmp;
                    return $scope.bus;
                default: return [];
            }
        };

        $scope.toggleLignes = function(ligneType) {
            if(ligneType===1){
                if($scope.rer){
                    delete $scope.rer;
                } else{
                    delete $scope.trans;
                    delete $scope.tram;
                    $scope.getLignes(ligneType);
                }
            }else if (ligneType === 2) {
                if($scope.trans){
                    delete $scope.trans;
                }else {
                    delete $scope.rer;
                    delete $scope.tram;
                    $scope.getLignes(ligneType);
                }
            }else if (ligneType === 3) {
                if($scope.tram) {
                    delete $scope.tram;
                } else {
                    delete $scope.trans;
                    delete $scope.rer;
                    $scope.getLignes(ligneType);
                }

            }
        };

        $scope.getStops = function () {
            var data = $scope.getBoundsMap();

            $http.post('http://localhost:8081/api/geosearch', JSON.stringify(data)).then(function (response) {
                $scope.stops = response.data;

            });
        };
        $scope.getStops();

        $scope.getOSMdata = function () {
            var data = $scope.getBoundsMap();
            $http.get('https://api.openstreetmap.org/api/0.6/map?bbox=' + data.minLon + ',' + data.minLat + ',' + data.maxLon + ',' + data.maxLat).then(function (response) {
                //OSM DATA
            });
        };
        $scope.getOSMdata();

        $scope.reloadData = function () {
            $scope.getStops();
        };


        $scope.searchStop = function () {
            var data = {searchText: $scope.searchText};
            return $http.post('http://localhost:8081/api/textsearch', JSON.stringify(data)).then(function (response) {
                return response.data;

            });
        };


        $scope.goToStop = function (stop) {
            $scope.clearMarkers();

            mymap.setView([stop.stop_lat, stop.stop_lon], $scope.zoom);
            $scope.makeStopMarker(stop);
        };

        $scope.makeStopMarker = function(stop) {
            var latlng = L.latLng(stop.stop_lat, stop.stop_lon);
            var origin = L.latLng($scope.coords.lat, $scope.coords.long);
            $scope.stopDistance = (mymap.distance(latlng, origin) / 1000).toFixed(2);

            var popup = L.popup()
                .setLatLng(latlng)
                .setContent('<h2>' + stop.stop_name + '</h2><p>Distance : <span>' + $scope.stopDistance + ' km</span></p>' +
                    '<md-button>Afficher horaires</md-button>')
                .openOn(mymap);

            var marker = L.marker([stop.stop_lat, stop.stop_lon]);

            $scope.markerStop = marker;

            marker.bindPopup(popup).openPopup().addTo(mymap);
        }


        $scope.openLoginModal = function (ev) {
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

        $scope.openLigneDialog = function (ligne) {
            $mdDialog.show({
                locals: {ligne: ligne, routes: $scope.routes},
                controller: 'ligneController',
                controllerAs: 'ligne',
                templateUrl: 'ligne.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            }).then(function (answer) {

            })
        };

        $scope.getRoutesLigne = function(ligne) {
            $scope.routesLigne= [];
            angular.forEach($scope.routes, function (route, key) {
                if(route.route_short_name === ligne.name){
                    $scope.routesLigne.push(route);
                }
            });
            return $scope.routesLigne;
        };
        $scope.getStopRoute = function(route) {
            var data = {route_id: route.route_id};
            return $http.post('http://localhost:8081/api/route/stops', JSON.stringify(data)).then(function(response){
                $scope.stopsRoute = response.data[0];
            })
        };

        $scope.showLigne = function(ligne) {
            $scope.getRoutesLigne(ligne);
            $scope.getStopRoute($scope.routesLigne[0]).then(function(){
                $scope.printLigne($scope.stopsRoute);
            })
        };

        $scope.printLigne = function(stopsRoute){
            $scope.clearMarkers();
            angular.forEach(stopsRoute, function(stop, key) {
                $scope.makeStopMarker(stop);
            })
        }

        $scope.setZoom = function () {
            mymap.setZoom($scope.zoom);
        }

        $scope.clearMarkers = function () {
            if ($scope.markerGeo) {
                mymap.removeLayer($scope.markerGeo);
                delete $scope.markerGeo
            }
            if ($scope.markerStop) {
                mymap.removeLayer($scope.markerStop);
                delete $scope.markerStop
            }
        };

        $scope.isAuthenticated = function () {
            return $localStorage.token !== undefined;
        };


        $scope.logout = function () {
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