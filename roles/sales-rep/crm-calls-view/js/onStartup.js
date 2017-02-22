define(["./account.js"], function (account) {
 
  function OnStartup (bezl) {        
      // Load the object for the selected customer from local storage into
      // a variable we can work with
      if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
          bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
      }

      // Also pull in the list of defined CRM call types.  This is expecting a plugin instance
      // to be defined in BRDB named sales-rep-calltypes which points to a data source for call
      // types
      bezl.dataService.add('CallTypes','brdb','sales-rep-queries','ExecuteQuery', { "QueryName": "GetCallTypes" },0);

      $(".panel").on("selectAccount", function(event, param1) {
        bezl.vars.selectedAccount = param1;
        bezl.vars.loadedMore = false;

        // If there are no CRM calls present with what was passed over, go
        // ahead and run the full query now
        if (!bezl.vars.selectedAccount.CRMCalls) {
          account.runQuery('CRMCalls');
        }

      });

  }
  
  return {
    onStartup: OnStartup
  }
});