define(["./account.js"], function (account) {
 
  function OnStartup (bezl) {        
      // Load the object for the selected customer from local storage into
      // a variable we can work with
      if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
          bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
          bezl.data.CRMCalls = bezl.vars.selectedAccount.CRMCalls;
      }

      // Also pull in the list of defined CRM call types.  This is expecting a plugin instance
      // to be defined in BRDB named sales-rep-calltypes which points to a data source for call
      // types
      bezl.dataService.add('CallTypes','brdb','sales-rep-queries','ExecuteQuery', { "QueryName": "GetCallTypes" },0);

      $(".panel").on("selectAccount", function(event, param1) {
        bezl.vars.selectedAccount = param1;
        bezl.data.CRMCalls = bezl.vars.selectedAccount.CRMCalls;
        bezl.vars.loadedMore = false;
      });

  }
  
  return {
    onStartup: OnStartup
  }
});