define(["./customer.js"], function (customer) {
 
    function OnDataChange (bezl) {
        if (bezl.data.CustList) {
            bezl.vars.loading = false;

            // Create an AddressURL column with an encoded version of each Address
            // so that it can be part of a Google Maps AddressURL
            for (var i = 0; i < bezl.data.CustList.length; i++) {
                bezl.data.CustList[i].AddressURL = encodeURI(bezl.data.CustList[i].Address);
            };
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});