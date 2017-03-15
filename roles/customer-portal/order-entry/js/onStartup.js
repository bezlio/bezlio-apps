define(["./customer.js"], function (order) {
 
    function OnStartup (bezl) {        
        // Initiate the call to refresh the customer list
        order.runQuery(bezl, 'Customers');
        order.runQuery(bezl, 'CustomersContacts');
        order.runQuery(bezl, 'CustomersShipTos');
    }
  
  return {
    onStartup: OnStartup
  }
});