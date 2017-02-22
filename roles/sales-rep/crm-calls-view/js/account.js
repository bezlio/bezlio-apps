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
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://rawgit.com/bezlio/bezlio-apps/development/libraries/epicor/crm.js'], function(functions) {
                functions.addNote(bezl
                                , bezl.vars.Platform
                                , bezl.vars.Connection
                                , bezl.vars.Company
                                , bezl.vars.selectedAccount.CustNum
                                , bezl.vars.shortSummary
                                , bezl.vars.details
                                , bezl.vars.type
                                , bezl.vars.selectedAccount.SalesRep);

                bezl.vars.shortSummary = '';
                bezl.vars.details = '';
                bezl.vars.type = '';
            }); 
        }

        var callTypeDesc = ''
        for (var i = 0; i < bezl.data.CallTypes.length; i++) {
            if (bezl.data.CallTypes[i].CallType == bezl.vars.type) {
                callTypeDesc = bezl.data.CallTypes[i].CallTypeDesc;
            }
        }
        

        bezl.vars.selectedAccount.CRMCalls.push({
            "ShortSummary"  : bezl.vars.shortSummary,
            "Details"       : bezl.vars.details,
            "CallDate"      : new  Date(),
            "SalesRepName"  : bezl.env.currentUser,
            "RelatedToFile" : "customer",
            "CallTypeDesc"  : callTypeDesc
        });
        
        bezl.vars.selectedAccount.CRMCalls.sort(function (a, b) {
            var A = Date.parse(a["CallDate"]) || Number.MAX_SAFE_INTEGER;
            var B = Date.parse(b["CallDate"]) || Number.MAX_SAFE_INTEGER;
            return B - A;
        });
    }
  
    return {
        runQuery: RunQuery,
        addNote: AddNote
    }
});