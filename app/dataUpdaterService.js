angular.module('myApp.dataUpdaterService').factory('dataUpdaterService', function($http){
    return {
        getStops: function() {
            var data = getBoundsMap();
            $http.post('http://localhost:8081/api/stops', JSON.stringify(data)).then(function (response) {
                return response.data;
            });
        },

        getBoundsMap: function(mymap) {
            var boundsMap = mymap.getBounds();
            var bounds = {
                minLat: boundsMap._southWest.lat,
                maxLat: boundsMap._northEast.lat,
                minLon: boundsMap._southWest.lng,
                maxLon: boundsMap._northEast.lng
            };
            return bounds;
        }
    }
});