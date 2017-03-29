define(["./customer.js",
        "./map.js"], function (customer, map) {
 
    function OnDataChange (bezl) {
        // Populate the 'customers' array if we got CustomerList back
        if (bezl.data.CustList) {

            // Reset Counters
            bezl.vars.geoLocsNeeded = 0;
            bezl.vars.geoLocsDone = 0;
             bezl.vars.custWithoutLocations = [];

            //resets if another attempt happens after one finishes.
            if(bezl.vars.geoTracker == 100) {
                bezl.vars.geoTracker = 0;
            }

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
                if(bezl.data.CustList[i].Geocode_Location == '' || bezl.data.CustList[i].Geocode_Location == null) {
                    bezl.vars.custWithoutLocations.push({ selected: false,
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
                    bezl.vars.geoLocsNeeded++;
                }
            }

            //Geocode each address that doesnt have a geocode.
            map.theNext(bezl);

            // Clean up CustList data subscription as we no longer need it
            bezl.dataService.remove('CustList');
            bezl.data.CustList = null;
            
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});