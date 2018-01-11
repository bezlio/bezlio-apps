define(["./map.js",
        "./customer.js"], function (map, customer) {
 
    function OnStartup (bezl) {
        // Initialize any variables used in the logic
        bezl.vars.currentAddress = "";
        bezl.vars.markers = [];
        bezl.vars.customers = [];
        bezl.vars.selectedCustomer = { "CustNum": 0 };
        bezl.vars.loading = { 
            customerList: true
        }

        bezl.vars.mapFile = map;
        bezl.vars.customerFile = customer;
        
        // Initiate the call to refresh the customer list
        bezl.vars.customerFile.runQuery(bezl, 'CustList');

        // Info Pin add customer event handler
        $("#bezlpanel").on("addCust_Pin", function(event) {
            console.log('in');
            console.log(event);
        });

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
                
                marker.addListener('click', function() {
                        bezl.vars.infoWindow.setContent(bezl.vars.mapFile.getInfoWindowContent({Name:'Current Location',
                                                                                    Address:bezl.vars.currentAddress,
                                                                                    Contacts:''}));
                        bezl.vars.infoWindow.open(bezl.vars.map, marker);

                        // After the info window is open, add a DOM listener for the add button
                        var addBtn = document.getElementById('addBtn');
                        google.maps.event.addDomListener(addBtn, "click", function() {
                            // Get the custNum from the button data
                            var custNum = $('#addBtn').attr('data-id');
                            // Find customer from custNum
                            var customer = bezl.vars.customers.find(c => c.custNum == custNum);
                            // Add Customer to trip
                            bezl.vars.customerFile.add(bezl, customer);
                        });
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