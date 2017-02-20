define(["./account.js"], function (account) {
 
  function OnStartup (bezl) {        
      // Initiate the call to refresh the crm calls
      account.runQuery(bezl, 'CRMCalls');

      // Load the object for the selected customer from local storage into
      // a variable we can work with
      if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
          bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
      }
  }
  
  return {
    onStartup: OnStartup
  }
});