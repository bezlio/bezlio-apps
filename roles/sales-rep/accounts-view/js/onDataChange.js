define(["./customer.js"], function (customer) {
 
    function OnDataChange (bezl) {
        if (bezl.data.CustList) {
            bezl.vars.loading = false;

            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.data.CustList.length; i++) {
                // Create an AddressURL column with an encoded version of each Address
                // so that it can be part of a Google Maps AddressURL
                bezl.data.CustList[i].AddressURL = encodeURI(bezl.data.CustList[i].Address);

                // Determine the distance from the current location, if applicable
                if (bezl.data.CustList[i].Geocode_Location) {
                    bezl.data.CustList[i].distance = CalcDistance(bezl.vars.currentLat
                                                                , bezl.vars.currentLng
                                                                , parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[0].split(':')[1])
                                                                , parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[1].split(':')[1]));
                }
            };
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});