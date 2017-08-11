define(["./account.js"], function (account) {
 
    function OnStartup (bezl) {        
        bezl.vars.filterString = ""

        // Initiate the call to refresh the customer list
        account.runQuery(bezl, 'Accounts');
        account.runQuery(bezl, 'CallTypes');
        account.runQuery(bezl, 'SalesRep');

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
