define([], function () {

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
                var custNum = $('#addBtn').attr('data-id');
                // Find customer from custNum
                var customer = bezl.vars.customers.find(c => c.custNum == custNum);
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
        bezl.vars.custCategory = filterValue;

        bezl.vars.markers.forEach(mark => {
            mark.setMap(null);
        });

        if (filterValue !== "All") {
            console.log(bezl.data.CustList);
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
                    Address: cust.Address,
                    Contacts: cust.Contacts
                });
            });
        }

        $("#customerGrid").jsGrid("loadData");
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