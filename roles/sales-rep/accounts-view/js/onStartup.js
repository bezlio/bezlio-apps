define(["./customer.js"], function (customer) {
 
    function OnStartup (bezl) {        
        // Initiate the call to refresh the customer list
        customer.runQuery(bezl, 'CustList');

        // Determine the current position of the user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) { 
              bezl.vars.currentLat = position.coords.latitude;
              bezl.vars.currentLng = position.coords.longitude;
            });
        }
    }
  
 
  return {
    onStartup: OnStartup
  }
});