define(["./map.js"], function (map) {

    function Select(bezl, custNum) {
        if (bezl.vars.markers[custNum]) {
            // Locate this customer and navigate to them on the map
            bezl.vars.infoWindow.setContent(bezl.vars.mapFile.getInfoWindowContent(bezl.vars.markers[custNum].title,
                bezl.vars.markers[custNum].data.Address,
                bezl.vars.markers[custNum].data.Contacts));

            bezl.vars.selectedCustomer = bezl.vars.markers[custNum].data;
            var center = new bezl.vars.client.LatLng(bezl.vars.markers[custNum].lat, bezl.vars.markers[custNum].lng);
            bezl.vars.map.panTo(center);

            bezl.vars.infoWindow.open(bezl.vars.map, bezl.vars.markers[custNum]);
        } else {
            // If there is not a marker for the given address, geocode it now
            for (var i = 0; i < bezl.vars.customers.length; i++) {
                if (bezl.vars.customers[i].custNum == custNum) {
                    bezl.vars.mapFile.geocodeAddress(bezl, bezl.vars.customers[i]);
                    break;
                }
            };
        }
    }

    function RunQuery(bezl, queryName) {

        switch (queryName) {
            case "CustList":
                // Pull in the customer list for the logged in user
                bezl.dataService.add('CustList', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "/map-view/GetCustomersWithAddress",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser },
                        { "Key": "Col", "Value": bezl.vars.Column }

                    ]
                }, 0);
                break;
            case "Categories":
                bezl.dataService.add('Categories', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "/map-view/GetFilterCategories",
                    "Parameters": [
                        { "Key": "Col", "Value": bezl.vars.Column }
                    ]
                }, 0);
                break;
        }
    }

    function Sort(bezl, column) {
        if (column == bezl.vars.sortCol) {
            // We clicked on the same column so make the sort opposite
            if (bezl.vars.sort == 'asc') {
                bezl.vars.sort = 'desc';
            } else {
                bezl.vars.sort = 'asc';
            }
        } else {
            // It is a new sort
            bezl.vars.sortCol = column;
            bezl.vars.sort = 'asc';
        }

        if (bezl.vars.sortCol == 'Name') {
            if (bezl.vars.sort == 'asc') {
                bezl.vars.customer = bezl.vars.customers.sort(function (a, b) {
                    var A = a.display.toUpperCase(); // ignore upper and lowercase
                    var B = b.display.toUpperCase(); // ignore upper and lowercase
                    if (A < B) {
                        return -1;
                    }
                    if (A > B) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                });
            } else {
                bezl.vars.customer = bezl.vars.customers.sort(function (a, b) {
                    var A = a.display.toUpperCase(); // ignore upper and lowercase
                    var B = b.display.toUpperCase(); // ignore upper and lowercase
                    if (A > B) {
                        return -1;
                    }
                    if (A < B) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                });
            }
        } else {
            if (bezl.vars.sort == 'asc') {
                bezl.vars.customer = bezl.vars.customers.sort(function (a, b) {
                    var A = a.distance || Number.MAX_SAFE_INTEGER;
                    var B = b.distance || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.customer = bezl.vars.customers.sort(function (a, b) {
                    var A = a.distance || Number.MAX_SAFE_INTEGER;
                    var B = b.distance || Number.MAX_SAFE_INTEGER;
                    return B - A;
                });
            }
        }
    }

    function ApplyCategory(bezl, filterValue) {
        bezl.vars.custCategory = filterValue;

        bezl.vars.markers.forEach(mark => {
            mark.setMap(null);
        });

        if (filterValue !== "All") {
            //rebuild customer grid before filtering
            bezl.vars.customers = [];

            bezl.data.CustList.forEach(cust => {
                bezl.vars.customers.push({
                    selected: false,
                    key: cust.CustNum,
                    display: cust.Name,
                    lastContact: (cust.LastContact || 'T').split('T')[0],
                    nextTaskDue: (cust.NextTaskDue || 'T').split('T')[0],
                    distance: null,
                    streetAddress: cust.Address,
                    title: cust.Name,
                    custNum: cust.CustNum,
                    shipToNum: cust.ShipToNum,
                    data: cust,
                    filterValue: cust.FilterValue,
                    geocodeAddress: cust.Geocode_Location
                });
            });

            bezl.vars.customers = bezl.vars.customers.filter(cust => cust.filterValue === filterValue);
        } else {
            bezl.vars.customers = [];

            bezl.data.CustList.forEach(cust => {
                bezl.vars.customers.push({
                    selected: false,
                    key: cust.CustNum,
                    display: cust.Name,
                    lastContact: (cust.LastContact || 'T').split('T')[0],
                    nextTaskDue: (cust.NextTaskDue || 'T').split('T')[0],
                    distance: null,
                    streetAddress: cust.Address,
                    title: cust.Name,
                    custNum: cust.CustNum,
                    shipToNum: cust.ShipToNum,
                    data: cust,
                    filterValue: cust.FilterValue,
                    geocodeAddress: cust.Geocode_Location
                });
            });
        }

        PlotData(bezl);
    }

    function PlotData(bezl) {
        bezl.vars.markers = [];

        bezl.vars.client = google.maps;
        bezl.vars.geocoder = new google.maps.Geocoder();
        bezl.vars.directionsService = new google.maps.DirectionsService;
        bezl.vars.directionsDisplay = new google.maps.DirectionsRenderer();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                // First create the map
                //console.log($(bezl.container.nativeElement).find("div#map"));
                bezl.vars.map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: position.coords.latitude, lng: position.coords.longitude },
                    scrollwheel: false,
                    zoom: 10
                });
                bezl.vars.directionsDisplay.setMap(bezl.vars.map);
                bezl.vars.directionsDisplay.setPanel(document.getElementById('directions'));

                // Create an infowindow
                bezl.vars.infoWindow = new google.maps.InfoWindow;

                // Drop a marker for home
                var marker = new google.maps.Marker({
                    position: { lat: position.coords.latitude, lng: position.coords.longitude },
                    map: bezl.vars.map,
                    label: 'A',
                    title: 'You are here',
                    data: '',
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });

                // Store the currently detected address
                bezl.vars.geocoder.geocode({ 'location': marker.position }, function (results, status) {
                    if (status === 'OK') {
                        bezl.vars.currentAddress = results[0].formatted_address;
                    } else {
                        bezl.notificationService.showError('Geocoder failed due to: ' + status);
                    }
                });

                marker.addListener('click', function () {
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

            setTimeout(setFilterMap, 2500);
            
        function setFilterMap() {
            bezl.vars.customers.forEach(cust => {
                if (cust.streetAddress != null) {
                    if (cust.streetAddress.length > 3) {

                        // Test to see whether we already saved the geocode.  If not, use the API to calculate it and save it
                        if (cust.geocodeAddress == "" || cust.geocodeAddress == null) {
                            map.geocodeAddress(
                                bezl,
                                {
                                    streetAddress: cust.streetAddress,
                                    title: cust.title,
                                    custNum: cust.custNum,
                                    shipToNum: cust.shipToNum,
                                    data: cust
                                }
                            );
                        } else {
                            var marker = new bezl.vars.client.Marker({
                                position: { lat: + parseFloat(cust.geocodeAddress.split(',')[0].split(':')[1]), lng: parseFloat(cust.geocodeAddress.split(',')[1].split(':')[1]) },
                                map: bezl.vars.map,
                                title: cust.title,
                                data: cust,
                                lat: parseFloat(cust.geocodeAddress.split(',')[0].split(':')[1]),
                                lng: parseFloat(cust.geocodeAddress.split(',')[1].split(':')[1])
                            });

                            // Add a click handler
                            marker.addListener('click', function () {
                                customer.select(bezl, cust.custNum);
                            });

                            bezl.vars.markers[cust.custNum] = marker;
                        }
                    }
                } else {
                    console.log('Customer\'s address does not exist, Customer: ' + cust.Name);
                }
            });

            setTimeout(map.calculateDistances(bezl), 5000);   
        }

        $("#customerGrid").jsGrid("loadData");
    }

    return {
        select: Select,
        sort: Sort,
        applyCategory: ApplyCategory,
        runQuery: RunQuery
    }
});