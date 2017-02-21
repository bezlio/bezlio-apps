define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "CRMCalls":
                bezl.vars.loading = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('CRMCalls','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetCallHistory",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser },
                        { "Key": "ID", "Value": bezl.vars.selectedAccount.ID }
                    ] },0);
                break;
            default:
                break;
        }
    }

    function AddNote (bezl) {

        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.CRMPlatform) {
            case "Epicor10":
                require(['https://rawgit.com/bezlio/bezlio-apps/master/libraries/epicor905/crm.js'], function(functions) {
                    functions.addNote(bezl)
                });
                break;
            case "Excel":
                require(['https://rawgit.com/bezlio/bezlio-apps/master/libraries/excel/crm.js'], function(functions) {
                    functions.addNote(bezl)
                });
                break;
            default:
                break;
        }

    }
  
    return {
        runQuery: RunQuery,
        addNote: AddNote
    }
});