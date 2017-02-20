define(["./account.js"], function (account) {
 
  function OnStartup (bezl) {        
      // Load the object for the selected customer from local storage into
      // a variable we can work with
      if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
          bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
      }

      // Initiate the call to refresh the crm calls
      if (bezl.vars.currentAccount) {
        account.runQuery(bezl, 'CRMCalls');
      }
  }
  
  return {
    onStartup: OnStartup
  }
});