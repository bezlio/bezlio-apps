define(["./map.js"], function (map) {

    function Add(bezl, customer) {
        // Add the selected customer to the list
        bezl.vars.selectedCustomers.push({ key: customer.key, display: customer.display, address: customer.streetAddress });
    }

    function Move(bezl, index, direction) {
        // Direction positive moves it down, negative moves it up (does it go before or after)
        // First get a copy of which one we are moving
        var copy = bezl.vars.selectedCustomers.slice(index, index + 1);
        // Now remove it from the array
        bezl.vars.selectedCustomers.splice(index, 1);
        // Now we splice it back in
        bezl.vars.selectedCustomers.splice(index + direction, 0, copy[0]);
    }

    function Select(bezl, custNum) {
        if (bezl.vars.markers[custNum]) {
            // Locate this customer and navigate to them on the map
            bezl.vars.infoWindow.setContent(bezl.vars.mapFile.getInfoWindowContent(bezl.vars.markers[custNum].data));

            bezl.vars.selectedCustomer = bezl.vars.markers[custNum].data;
            var center = new bezl.vars.client.LatLng(bezl.vars.markers[custNum].lat, bezl.vars.markers[custNum].lng);
            bezl.vars.map.panTo(center);

            bezl.vars.infoWindow.open(bezl.vars.map, bezl.vars.markers[custNum]);

            // After the info window is open, add a DOM listener for the add button
            var addBtn = document.getElementById('addBtn');
            google.maps.event.addDomListener(addBtn, "click", function () {
                // Get the custNum from the button data
                var custKey = $('#addBtn').attr('data-id');
                // Find customer from custNum
                var customer = bezl.vars.customers.find(c => c.key == custKey);
                // Add Customer to trip
                bezl.vars.customerFile.add(bezl, customer);
            });
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
        bezl.vars.selectedCustomers = [];
        bezl.vars.markers = [];
        bezl.vars.directionsDisplay.setPanel(null);

        bezl.vars.custCategory = filterValue;

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
                    geocodeAddress: cust.Geocode_Location,
                    Name: cust.Name,
                    Address: cust.Address,
                    Contacts: cust.Contacts
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
                    geocodeAddress: cust.Geocode_Location,
                    Name: cust.Name,
                    Address: cust.Address,
                    Contacts: cust.Contacts
                });
            });
        }

        $("#customerGrid").jsGrid("loadData");
        PlotData(bezl);
    }

    function PlotData(bezl) {
        bezl.vars.client = google.maps;
        bezl.vars.geocoder = new google.maps.Geocoder();
        bezl.vars.directionsService = new google.maps.DirectionsService;
        bezl.vars.directionsDisplay = new google.maps.DirectionsRenderer();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                // First create the map
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

        setTimeout(setFilterMap, 1500);

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

            map.calculateDistances(bezl);
        }
    }

    function Remove(bezl, index) {
        // Remove the selected customer
        bezl.vars.selectedCustomers.splice(index, 1);
    }

    function RunQuery(bezl, queryName) {

        switch (queryName) {
            case "CustList":
                // Pull in the customer list for the logged in user
                bezl.dataService.add('CustList', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "/trip-planner/GetCustomersWithAddress",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser },
                        { "Key": "Col", "Value": bezl.vars.Column }
                    ]
                }, 0);
                break;
            case "Categories":
                bezl.dataService.add('Categories', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "/trip-planner/GetFilterCategories",
                    "Parameters": [
                        { "Key": "Col", "Value": bezl.vars.Column }
                    ]
                }, 0);
                break;
        }
    }

    return {
        add: Add,
        move: Move,
        select: Select,
        sort: Sort,
        applyCategory: ApplyCategory,
        remove: Remove,
        runQuery: RunQuery
    }
});