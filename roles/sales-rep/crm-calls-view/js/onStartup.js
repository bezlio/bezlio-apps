define(["./account.js"], function (account) {
 
  function OnStartup (bezl) {        
      bezl.vars.filterString = "";

      // Load the object for the selected customer from local storage into
      // a variable we can work with
      if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
          bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));

          // Perform additional processing on the returned data
          for (var i = 0; i < bezl.vars.selectedAccount.CRMCalls.length; i++) {
            bezl.vars.selectedAccount.CRMCalls[i].show = true;
          }
      }

      // Refresh all call data at regular interval
      account.runQuery(bezl, "AllCRMCalls");

      // Also pull in the list of defined CRM call types.  This is expecting a plugin instance
      // to be defined in BRDB named sales-rep-calltypes which points to a data source for call
      // types
      bezl.dataService.add('CallTypes','brdb','sales-rep-queries','ExecuteQuery', { "QueryName": "GetCallTypes" },0);

      $(".panel").on("selectAccount", function(event, param1) {
        bezl.vars.selectedAccount = param1;
        bezl.vars.loadedMore = false;

        // Load up the CRM calls for this newly selected account
        if (bezl.data.AllCRMCalls) {
            bezl.vars.selectedAccount.CRMCalls = [];
            for (var i = 0; i < bezl.data.AllCRMCalls.length; i++) {
                if (bezl.data.AllCRMCalls[i].ID == bezl.vars.selectedAccount.ID) {
                    bezl.vars.selectedAccount.CRMCalls.push(bezl.data.AllCRMCalls[i])
                }
            }
        }

        // If there are no CRM calls present with what was passed over, go
        // ahead and run the full query now
        if (!bezl.vars.selectedAccount.CRMCalls) {
          account.runQuery(bezl, "CRMCalls");
        } else {
          // Perform additional processing on the returned data
          for (var i = 0; i < bezl.vars.selectedAccount.CRMCalls.length; i++) {
            bezl.vars.selectedAccount.CRMCalls[i].show = true;
          }
        }

        $(bezl.container.nativeElement).find('#filterString')[0].value = ""; // Clear out the search filter box

      });

      // Prepopulate the CRM new interaction form for click to call/email/navigate
      // Should pass data in param1 in the form of:
      // {
      //   "type": <enum: "phone", "email", "navigate">,
      //   "shortSummary": <string>,
      //   "details": <string>
      // }
      $(".panel").on("CRMNewInteraction", function(event, param1) {
        // TODO: look up an appropriate type from the CallTypes list
        // This should eventually be a config option to select the local
        // CallType to be used for phone/email/navigate. For now we will use
        // some much less useful default strings.
        switch (param1.type) {
            case "phone":
                bezl.vars.type = "Sales";
                break;
            case "email":
                bezl.vars.type = "Email";
                break;
            case "navigate":
                bezl.vars.type = "Customer Visit";
                break;
        }

        bezl.vars.shortSummary = param1.shortSummary;
        bezl.vars.details = param1.details;
      });
  }
  
  return {
    onStartup: OnStartup
  }
});
