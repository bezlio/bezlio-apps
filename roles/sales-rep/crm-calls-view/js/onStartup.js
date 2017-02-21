define(["./account.js"], function (account) {
 
  function OnStartup (bezl) {        
      // Load the object for the selected customer from local storage into
      // a variable we can work with
      if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
          bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
      }

      // Initiate the call to refresh the crm calls
      if (bezl.vars.selectedAccount != null) {
        account.runQuery(bezl, 'CRMCalls');
      }

      // Also pull in the list of defined CRM call types.  This is expecting a plugin instance
      // to be defined in BRDB named sales-rep-calltypes which points to a data source for call
      // types
      bezl.dataService.add('CallTypes','brdb','sales-rep-queries','ExecuteQuery', { "QueryName": "GetCallTypes" },0);

      $(".panel").on("selectAccount", function(event, param1) {
        bezl.vars.selectedAccount = param1;
        account.runQuery(bezl, 'CRMCalls');
      });

  }
  
  return {
    onStartup: OnStartup
  }
});