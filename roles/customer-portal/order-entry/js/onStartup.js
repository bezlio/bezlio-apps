define(["./customer.js"], function (customer) {
 
    function OnStartup (bezl) {        
        // Initiate the call to refresh the customer list
        customer.runQuery(bezl, 'Customers');
        customer.runQuery(bezl, 'CustomersContacts');
        customer.runQuery(bezl, 'CustomersShipTos');
        customer.runQuery(bezl, 'GetGlobalParts');
    }
  
  return {
    onStartup: OnStartup
  }
});