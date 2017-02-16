define(["./customer.js"], function (customer) {
 
    function OnStartup (bezl) {        
        // Initiate the call to refresh the customer list
        customer.runQuery(bezl, 'CustList');
    }
  
 
  return {
    onStartup: OnStartup
  }
});