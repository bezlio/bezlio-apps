define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Accounts) {
            // If there was a previously selected account in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedAccount = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
                bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
            }

            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.data.Accounts.length; i++) {
                // Add a Selected property to the account record
                if (bezl.data.Accounts[i].ID == bezl.vars.selectedAccount.ID) {
                    bezl.data.Accounts[i].Selected = true;
                } else {
                    bezl.data.Accounts[i].Selected = false;
                }
                

                // Create an AddressURL column with an encoded version of each Address
                // so that it can be part of a Google Maps AddressURL
                bezl.data.Accounts[i].AddressURL = encodeURI(bezl.data.Accounts[i].Address);

                // Determine the distance from the current location, if applicable
                if (bezl.data.Accounts[i].Geocode_Location) {
                    bezl.data.Accounts[i].Distance = CalcDistance(bezl.vars.currentLat
                                                                , bezl.vars.currentLng
                                                                , parseFloat(bezl.data.Accounts[i].Geocode_Location.split(',')[0].split(':')[1])
                                                                , parseFloat(bezl.data.Accounts[i].Geocode_Location.split(',')[1].split(':')[1]));
                }

                // This will get filled in on the AccountContacts query
                bezl.data.Accounts[i].Contacts = [];

                // Same thing with the recent CRM calls
                bezl.data.Accounts[x].CRMCalls = [];
            };

            bezl.vars.loading = false;
        }

        // If we got the account contacts back, merge those in
        if (bezl.data.Accounts && bezl.data.AccountContacts) {
            for (var i = 0; i < bezl.data.AccountContacts.length; i++) {
                for (var x = 0; x < bezl.data.Accounts.length; x++) {
                    if (bezl.data.AccountContacts[i].ID == bezl.data.Accounts[x].ID) {
                        bezl.data.Accounts[x].Contacts.push(bezl.data.AccountContacts[i]);
                    }
                }
            }

            bezl.vars.loadingContacts = false;
            bezl.data.AccountContacts = null;
            bezl.dataService.remove('AccountContacts');
        }

        // If we got the account calls back, merge those in
        if (bezl.data.Account && bezl.data.CRMCalls) {
            for (var i = 0; i < bezl.data.CRMCalls.length; i++) {
                for (var x = 0; x < bezl.data.Accounts.length; x++) {
                    if (bezl.data.CRMCalls[i].ID == bezl.data.Accounts[x].ID) {
                        bezl.data.Accounts[x].CRMCalls.push(bezl.data.CRMCalls[i]);
                    }
                }
            }

            bezl.vars.loadingCalls = false;
            bezl.data.CRMCalls = null;
            bezl.dataService.remove('CRMCalls');
        }

        // If we got the account calls back, merge those in
        if (bezl.data.CRMCalls) {
            if (bezl.data.Accounts) {
            for (var i = 0; i < bezl.data.CRMCalls.length; i++) {
                for (var x = 0; x < bezl.data.Accounts.length; x++) {
                    if (bezl.data.CRMCalls[i].ID == bezl.data.Accounts[x].ID) {
                        bezl.data.Accounts[x].CRMCalls.push(bezl.data.CRMCalls[i]);
                    }
                }
            }

            bezl.vars.loadingCalls = false;
            bezl.data.CRMCalls = null;
            bezl.dataService.remove('CRMCalls');
            }
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