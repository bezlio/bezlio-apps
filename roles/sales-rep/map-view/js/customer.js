define(["./map.js"], function (map) {
 
    function Select (bezl, custNum) {
        if (bezl.vars.markers[custNum]) {
        // Locate this customer and navigate to them on the map
        bezl.vars.infoWindow.setContent(map.getInfoWindowContent(bezl.vars.markers[custNum].title,
                                                                    bezl.vars.markers[custNum].data.Address,
                                                                    bezl.vars.markers[custNum].data.Contacts));

        bezl.vars.selectedCustomer = bezl.vars.markers[custNum].data;
        bezl.vars.selectedCustomer.EstDate = (bezl.vars.selectedCustomer.EstDate || 'T').split('T')[0];
        bezl.vars.selectedCustomer.LastContact = (bezl.vars.selectedCustomer.LastContact || 'T').split('T')[0];
        bezl.vars.infoWindow.open(bezl.vars.map, bezl.vars.markers[custNum]);

        $('html, body').animate({
                scrollTop: $("#map").offset().top
            }, 2000);
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
                    "QueryName": "GetCustomersWithAddress",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            default:
                break;
        }
    }

  
    return {
        select: Select,
        runQuery: RunQuery
    }
});