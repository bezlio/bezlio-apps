define([], function () {
 
    function OnDataChange (bezl) {
        // Populate the 'customers' array if we got CustomerList back
        if (bezl.data.CustList) {
            bezl.vars.customers = [];
            for (var i = 0; i < bezl.data.CustList.length; i++) {
                bezl.vars.customers.push({ selected: false,
                                            key: bezl.data.CustList[i].CustNum,
                                            display: bezl.data.CustList[i].Name,
                                            distance: null,
                                            streetAddress: bezl.data.CustList[i].Address, 
                                            title: bezl.data.CustList[i].Name, 
                                            custNum: bezl.data.CustList[i].CustNum,
                                            shipToNum: bezl.data.CustList[i].ShipToNum,
                                            data: bezl.data.CustList[i]
                                            });
            }
        
            // Configure the typeahead controls for the customer and customer search.  For full documentation of
            // available settings here see http://www.runningcoder.org/jquerytypeahead/documentation/
            $('.js-typeahead-customers').typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function() { return bezl.vars.customers; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        bezl.vars.customerFile.select(bezl, item.key);
                    }
                }
            });
                    
            bezl.vars.loading.customerList = false;
            
            // Now loop through the results and plot each
            for (var i = 0; i < bezl.data.CustList.length; i++) {
                if (bezl.data.CustList[i].Address.length > 3) {
                
                    // Test to see whether we already saved the geocode.  If not, use the API to calculate it and save it
                    if (bezl.data.CustList[i].Geocode_Location == "" ||  bezl.data.CustList[i].Geocode_Location == null) {
                        bezl.vars.mapFile.geocodeAddress(
                            bezl, 
                            { 
                                streetAddress: bezl.data.CustList[i].Address, 
                                title: bezl.data.CustList[i].Name, 
                                custNum: bezl.data.CustList[i].CustNum,
                                shipToNum: bezl.data.CustList[i].ShipToNum,
                                data: bezl.data.CustList[i] 
                            }
                        );                   
                    } else {
                        var marker = new bezl.vars.client.Marker({
                            position: { lat: + parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[0].split(':')[1]), lng: parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[1].split(':')[1]) },
                            map: bezl.vars.map,
                            title: bezl.data.CustList[i].Name,
                            data: bezl.data.CustList[i],
                            lat: parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[0].split(':')[1]),
                            lng: parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[1].split(':')[1])
                        });

                        // Add a click handler
                        marker.addListener('click', function() {
                            bezl.vars.customerFile.select(bezl, this.data.CustNum);
                        });
                        
                        bezl.vars.markers[bezl.data.CustList[i].CustNum] = marker;
                    }
                }
            };   
        
            // Calculate distances
            bezl.vars.mapFile.calculateDistances(bezl);

            // Clean up CustList data subscription as we no longer need it
            bezl.dataService.remove('CustList');
            bezl.data.CustList = null;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});