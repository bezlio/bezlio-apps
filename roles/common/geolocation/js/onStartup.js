define(["./map.js",
        "./customer.js"], function (map, customer) {
 
    function OnStartup (bezl) {

        // Google Maps requires async so pull it in.
        require.config({
            paths: {
                'async': '/node_modules/requirejs-plugins/src/async'
            }
        });

        require(['async!https://maps.googleapis.com/maps/api/js?key=' + bezl.vars.config.GoogleAPIKey], function() {
            // Google Maps API and all its dependencies will be loaded here.
            bezl.vars.client = google.maps;
            bezl.vars.geocoder = new google.maps.Geocoder();
            bezl.vars.directionsService = new google.maps.DirectionsService;
            bezl.vars.directionsDisplay = new google.maps.DirectionsRenderer();
            bezl.vars.geoTracker = 0;
            bezl.vars.geoLocsNeeded = 0;
            bezl.vars.geoLocsDone = 0;
            bezl.vars.custWithoutLocations = [];

                
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) { 
                // First create the map
                //console.log($(bezl.container.nativeElement).find("div#map"));
                bezl.vars.map = new google.maps.Map(document.getElementById('map'), {
                        center: {lat: position.coords.latitude, lng: position.coords.longitude},
                        scrollwheel: false,
                        zoom: 10
                    });
                bezl.vars.directionsDisplay.setMap(bezl.vars.map);
                bezl.vars.directionsDisplay.setPanel(document.getElementById('directions'));
                
                // Create an infowindow
                bezl.vars.infoWindow = new google.maps.InfoWindow;
                                
                // Drop a marker for home
                var marker = new google.maps.Marker({
                    position: {lat: position.coords.latitude, lng: position.coords.longitude},
                    map: bezl.vars.map,
                    label: 'A',
                    title: 'You are here',
                    data: '',
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });   
                
                // Store the currently detected address
                bezl.vars.geocoder.geocode({'location': marker.position}, function(results, status) {
                    if (status === 'OK') {
                        bezl.vars.currentAddress = results[0].formatted_address;
                    } else {
                        bezl.notificationService.showError('Geocoder failed due to: ' + status);
                    }
                });
                
                bezl.vars.markers[0] = (marker);

                
                });
            } else {
                bezl.notificationService.showError('MESSAGE: ' + "Geolocation is not supported by this browser.");
            }
        });
    }
  
 
  return {
    onStartup: OnStartup
  }
});