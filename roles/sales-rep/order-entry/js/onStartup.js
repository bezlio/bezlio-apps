define(["./order.js"], function (order) {
 
    function OnStartup (bezl) {        
        // Initiate the call to refresh the customer list
        order.runQuery(bezl, 'Accounts');
        order.runQuery(bezl, 'AccountContacts');
        order.runQuery(bezl, 'AccountShipTos');
    }
  
  return {
    onStartup: OnStartup
  }
});