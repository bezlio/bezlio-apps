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
      bezl.dataService.add('AllCRMCalls','brdb','sales-rep-queries','ExecuteQuery', { 
        "QueryName": "GetAccountsCallHistory",
        "Parameters": [
          { "Key": "EmailAddress", "Value": bezl.env.currentUser }
        ] }, 1);

      // Also pull in the list of defined CRM call types.  This is expecting a plugin instance
      // to be defined in BRDB named sales-rep-calltypes which points to a data source for call
      // types
      bezl.dataService.add('CallTypes','brdb','sales-rep-queries','ExecuteQuery', { "QueryName": "GetCallTypes" },0);

      // Query for the sales rep associated with the logged in Bezlio user
      bezl.dataService.add('SalesRep','brdb','sales-rep-queries','ExecuteQuery'
                            , { "QueryName": "GetSalesRep"
                            , "Parameters": [
                                { "EmailAddress": bezl.env.currentUser }
                            ] },0);

      $("#bezlpanel").on("selectAccount", function(event, param1) {
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

        // Perform additional processing on the returned data
        for (var i = 0; i < bezl.vars.selectedAccount.CRMCalls.length; i++) {
          bezl.vars.selectedAccount.CRMCalls[i].show = true;
        }

        $(bezl.container.nativeElement).find('#filterString')[0].value = ""; // Clear out the search filter box
        bezl.vars.filterString = "";

      });

      // Prepopulate the CRM new interaction form for click to call/email/navigate
      // Should pass data in crmInteraction in the form of:
      // {
      //   "type": <enum: "phone", "email", "navigate">,
      //   "shortSummary": <string>,
      //   "details": <string>
      // }
      function _handleNewCRMInteraction(crmInteraction) {
        // TODO: look up an appropriate type from the CallTypes list
        // This should eventually be a config option to select the local
        // CallType to be used for phone/email/navigate. For now we will use
        // some much less useful default strings.
        switch (crmInteraction.type) {
            case "phone":
                bezl.vars.type = "Sales";
                break;
            case "email":
                bezl.vars.type = "Email";
                break;
            case "navigate":
                bezl.vars.type = "Customer Visit";
                break;
            default:
                bezl.vars.type = "";
        }

        bezl.vars.shortSummary = crmInteraction.shortSummary;
        bezl.vars.details = crmInteraction.details;
      }
      $("#bezlpanel").on("CRMNewInteraction", function(event, param1) {
          _handleNewCRMInteraction(param1);
      });
      // If case the bezels are on separate panels we will also check if there is a new CRM interaction stored in local storage
      if (typeof(Storage) !== "undefined" && localStorage.getItem("CRMNewInteraction")) {
          var crmNewInteraction  = JSON.parse(localStorage.getItem("CRMNewInteraction"));
          _handleNewCRMInteraction(crmNewInteraction);
          localStorage.setItem("CRMNewInteraction", ""); // Clear out the stored data now that we are done with it
      }
  }
  
  return {
    onStartup: OnStartup
  }
});
