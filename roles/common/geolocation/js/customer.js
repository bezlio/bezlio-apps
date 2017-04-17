define(["./map.js"], function (map) {
 
    function Select (bezl, custNum) {
        if (bezl.vars.markers[custNum]) {
            // Locate this customer and navigate to them on the map
            bezl.vars.infoWindow.setContent(map.getInfoWindowContent(bezl.vars.markers[custNum].title,
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
                    map.geocodeAddress(bezl, bezl.vars.customers[i]); 
                    break;
                }
            };
        }
    }

    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "CustList":
                // Pull in the customer list for the logged in user
                bezl.dataService.add('CustList','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "/Geocoder/GetCustomersWithAddress",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            default:
                break;
        }
    }

    function Sort (bezl, column) {
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
            bezl.vars.customer = bezl.vars.customers.sort(function (a,b) {                    
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
            bezl.vars.customer = bezl.vars.customers.sort(function (a,b) {                    
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
            bezl.vars.customer = bezl.vars.customers.sort(function (a,b) {                    
                var A = a.distance || Number.MAX_SAFE_INTEGER;
                var B = b.distance || Number.MAX_SAFE_INTEGER;
                return A - B;
            });
            } else {
            bezl.vars.customer = bezl.vars.customers.sort(function (a,b) {                    
                var A = a.distance || Number.MAX_SAFE_INTEGER;
                var B = b.distance || Number.MAX_SAFE_INTEGER;
                return B - A;
            });
            }
        }
    }

  
    return {
        select: Select,
        sort: Sort,
        runQuery: RunQuery
    }
});