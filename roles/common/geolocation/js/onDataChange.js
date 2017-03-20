define(["./customer.js",
        "./map.js"], function (customer, map) {
 
    function OnDataChange (bezl) {
        // Populate the 'customers' array if we got CustomerList back
        if (bezl.data.CustList) {

            // Reset Counters
            bezl.vars.geoTracker = 0;
            bezl.vars.geoLocsNeeded = 0;
            bezl.vars.geoLocsDone = 0;

            bezl.vars.loading.customerList = true;
            bezl.vars.customers = [];
            for (var i = 0; i < bezl.data.CustList.length; i++) {
                bezl.vars.customers.push({ selected: false,
                                            key: bezl.data.CustList[i].CustNum,
                                            display: bezl.data.CustList[i].Name,
                                            lastContact: (bezl.data.CustList[i].LastContact || 'T').split('T')[0],
                                            nextTaskDue: (bezl.data.CustList[i].NextTaskDue || 'T').split('T')[0],
                                            distance: null,
                                            streetAddress: bezl.data.CustList[i].Address, 
                                            title: bezl.data.CustList[i].Name, 
                                            custNum: bezl.data.CustList[i].CustNum,
                                            shipToNum: bezl.data.CustList[i].ShipToNum,
                                            data: bezl.data.CustList[i]
                                        });
                                        
                // Find how many address need geolocs
                if(bezl.data.CustList[i].Geocode_Location != '' || bezl.data.CustList[i].Geocode_Location != null) {
                    bezl.vars.geoLocsNeeded++;
                }
            }
        
            // Configure the typeahead controls for the customer and customer search.  For full documentation of
            // available settings here see http://www.runningcoder.org/jquerytypeahead/documentation/
            /*$('.js-typeahead-customers').typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function() { return bezl.vars.customers; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        customer.select(bezl, item.key);
                    }
                }
            });
        
            $('.js-typeahead-customers2').typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function() { return bezl.vars.customers; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        customer.select(bezl, item);
                    }
                }
            });
                    
            bezl.vars.loading.customerList = false;*/

            

            //Geocode each address
            map.theNext(bezl);

            // Clean up CustList data subscription as we no longer need it
            bezl.dataService.remove('CustList');
            bezl.data.CustList = null;
            bezl.vars.loading.customerList = false;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});