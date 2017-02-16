define(["./customer.js"], function (customer) {
 
    function OnDataChange (bezl) {
        if (bezl.data.CustList) {
            bezl.vars.loading = false;

            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.data.CustList.length; i++) {
                // Add a Selected property to the customer record
                bezl.data.CustList[i].Selected = false;

                // Create an AddressURL column with an encoded version of each Address
                // so that it can be part of a Google Maps AddressURL
                bezl.data.CustList[i].AddressURL = encodeURI(bezl.data.CustList[i].Address);

                // Determine the distance from the current location, if applicable
                if (bezl.data.CustList[i].Geocode_Location) {
                    bezl.data.CustList[i].Distance = CalcDistance(bezl.vars.currentLat
                                                                , bezl.vars.currentLng
                                                                , parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[0].split(':')[1])
                                                                , parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[1].split(':')[1]));
                }
            };
        }
    }

    function CalcDistance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return Math.round(dist)
    }
  
    return {
        onDataChange: OnDataChange
    }
});