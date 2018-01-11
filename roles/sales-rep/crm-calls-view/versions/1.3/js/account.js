define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "CRMCalls":
                bezl.vars.loading = true; 
                if(bezl.vars.selectedAccount) {
                // Pull in the call list for just the currently selected account
                bezl.dataService.add('CRMCalls','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountCallHistory",
                    "Parameters": [
                        { "Key": "ID", "Value": bezl.vars.selectedAccount.ID }
                    ] },0);
                } else {
                    bezl.vars.loading = false;
                }
                break;
            case "AllCRMCalls":
                bezl.vars.loading = true; 
                // Pull in the call list 
                 bezl.dataService.add('AllCRMCalls','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountsCallHistory",
                    "Parameters": [
                    { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] }, 1);
                break;
            case 'Accounts':
                bezl.vars.loading = true;
                // Get All Accounts associated with user
                bezl.dataService.add('Accounts','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccounts",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
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
            require([bezl.vars.config.baseLibraryUrl + 'epicor/crm.js'], function(functions) {
                functions.addNote(bezl
                                , bezl.vars.selectedAccount.Company
                                , bezl.vars.selectedAccount.CustNum
                                , bezl.vars.shortSummary
                                , bezl.vars.details
                                , bezl.vars.type
                                , ((bezl.data.SalesRep.length > 0) ? bezl.data.SalesRep[0].SalesRepCode : bezl.vars.selectedAccount.SalesRep));

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

        var newCallDict = {
            "ShortSummary"  : bezl.vars.shortSummary,
            "Details"       : bezl.vars.details,
            "CallDate"      : new  Date(),
            "SalesRepName"  : bezl.env.currentUser,
            "RelatedToFile" : "customer",
            "CallTypeDesc"  : callTypeDesc,
            "ID"            : bezl.vars.selectedAccount.ID,
            "show"          : true
        };

        bezl.vars.selectedAccount.CRMCalls.push(newCallDict);

        SortCalls(bezl);
        
        localStorage.setItem('selectedAccount', JSON.stringify(bezl.vars.selectedAccount));
    }

    // Only display CRM interactions that have data matching the data string in the
    // filter input box. This function updates the "show" variable on the
    // CRM call object.
    function ApplyFilter(bezl) {
        if (bezl.vars.selectedAccount.CRMCalls) { // Avoid throwing errors if the account data hasn't been returned yet
            for (var i = 0; i < bezl.vars.selectedAccount.CRMCalls.length; i++) {
                if (bezl.vars.selectedAccount.CRMCalls[i].ShortSummary.toUpperCase().indexOf(bezl.vars.filterString.toUpperCase()) !== -1 ||
                bezl.vars.selectedAccount.CRMCalls[i].Details.toUpperCase().indexOf(bezl.vars.filterString.toUpperCase()) !== -1) {
                    bezl.vars.selectedAccount.CRMCalls[i].show = true;
                } else {
                    bezl.vars.selectedAccount.CRMCalls[i].show = false;
                }
            };
        }
    }

    function SortCalls(bezl) {
        bezl.vars.selectedAccount.CRMCalls.sort(function (a, b) {
            var A = Date.parse(a["CallDate"]) || Number.MAX_SAFE_INTEGER;
            var B = Date.parse(b["CallDate"]) || Number.MAX_SAFE_INTEGER;
            return B - A;
        });
    }

     function CustSelection(bezl, custId) {

        var cust = bezl.vars.custList.find(c => c.ID == custId);
        bezl.vars.selectedAccount = cust;
        bezl.vars.loadedMore = false;
        if(custId == "ALL_ACCOUNTS" ){
            this.runQuery(bezl, 'AllCRMCalls');
        } else {
            this.runQuery(bezl, 'CRMCalls');
        }
    }
  
    return {
        runQuery: RunQuery,
        addNote: AddNote,
        applyFilter: ApplyFilter,
        sortCalls: SortCalls,
        custSelection: CustSelection
    }
});
