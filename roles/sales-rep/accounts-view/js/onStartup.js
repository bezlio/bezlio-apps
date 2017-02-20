define(["./account.js"], function (account) {
 
    function OnStartup (bezl) {        
        // Initiate the call to refresh the customer list
        account.runQuery(bezl, 'Accounts');
        account.runQuery(bezl, 'AccountContacts');

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