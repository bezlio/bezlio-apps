define(["./map.js",
        "./customer.js"], function (map, customer) {
 
    function OnStartup (bezl) {
        // Initialize any variables used in the logic
        bezl.vars.currentAddress = "";
        bezl.vars.markers = [];
        bezl.vars.customers = [];
        bezl.vars.selectedCustomer = { "CustNum": 0 };
        bezl.vars.loading = { 
            customerList: true,
            inquiry: false,
            crmHistory: false,
            invoiceHistory: false,
            attachment: []
        }
        
        // Initiate the call to refresh the customer list
        customer.runQuery(bezl, 'CustList');

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
                
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) { 
                // First create the map
                bezl.vars.map = new google.maps.Map(document.getElementById('map'), {
                        center: {lat: position.coords.latitude, lng: position.coords.longitude},
                        scrollwheel: false,
                        zoom: 10
                    });
                
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
                        bezl.vars.infoWindow.setContent(map.getInfoWindowContent('Current Location',
                                                                                    bezl.vars.currentAddress,
                                                                                    ''));
                        bezl.vars.infoWindow.open(bezl.vars.map, marker);
                });
                
                bezl.vars.markers[0] = (marker);

                
                });
            } else {
                bezl.notificationService.showError('MESSAGE: ' + "Geolocation is not supported by this browser.");
            }
        });


        // Configure the jsGrid
        bezl.vars.jsgrid = $("#customerGrid");
        bezl.vars.jsgrid.jsGrid({
            width: "100%",
            height: "100%",
            heading: true,
            sorting: true,
            autoload: true, 	
            inserting: false,
            controller: {
                loadData: function() {
                return bezl.vars.customers;
                }
            },
            fields: [
                { name: "display", title: "Name", type: "text", visible: true, width: 50, editing: false },
                { name: "distance", title: "Distance", type: "number", visible: true, width: 25, editing: false },
            ],
            rowClick: function(args) {
                customer.select(bezl, args.item.key);

                // Highlight the selected row in jsGrid
                if ( bezl.vars.selectedRow ) { bezl.vars.selectedRow.children('.jsgrid-cell').css('background-color', ''); }
                var $row = this.rowByItem(args.item);
                $row.children('.jsgrid-cell').css('background-color','#F7B64B');
                bezl.vars.selectedRow = $row;
            }
        });
    }
  
 
  return {
    onStartup: OnStartup
  }
});