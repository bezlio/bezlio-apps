define(["./account.js"], function (account) {
 
    function OnDataChange (bezl) {
        if (bezl.data.CRMCalls && bezl.vars.loading) {
            bezl.vars.loading = false;
            bezl.vars.selectedAccount.CRMCalls = bezl.data.CRMCalls;

            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.vars.selectedAccount.CRMCalls.length; i++) {
                bezl.vars.selectedAccount.CRMCalls[i].show = true;
            }
        }

        // Note: If user has clicked on the "more" button then auto updates
        // will no longer display because the auto updates are just a subset of
        // the full data
        if (bezl.data.AllCRMCalls && !bezl.vars.loadedMore) { 
            //bezl.vars.loadingAllCalls = false;

            // Set the currently selected accounts call data
            if (bezl.vars.selectedAccount.ID == "ALL_ACCOUNTS") {
                bezl.vars.selectedAccount.CRMCalls = [];
                bezl.vars.selectedAccount.CRMCalls = bezl.data.AllCRMCalls;
            } else if (bezl.vars.selectedAccount) {
                bezl.vars.selectedAccount.CRMCalls = [];
                for (var i = 0; i < bezl.data.AllCRMCalls.length; i++) {
                    if (bezl.data.AllCRMCalls[i].ID == bezl.vars.selectedAccount.ID) {
                        bezl.vars.selectedAccount.CRMCalls.push(bezl.data.AllCRMCalls[i])
                    }
                }
            }

            // Perform additional processing on the returned data
            account.applyFilter(bezl);
            account.sortCalls(bezl);
        }

        if (bezl.data.AddCRMCall) {
            if (bezl.data.AddCRMCall.BOUpdError && bezl.data.AddCRMCall.BOUpdError.length > 0) {
                bezl.notificationService.showCriticalError(JSON.stringify(bezl.data.AddCRMCall.BOUpdError));
            }

            bezl.data.AddCRMCall = null;
            bezl.dataService.remove('AddCRMCall');
        }

        if(bezl.data.Accounts) {
            bezl.vars.custList = bezl.data.Accounts;
            if(!bezl.vars.custList.find(a => a.ID == "ALL_ACCOUNTS")) {
                bezl.vars.custList.unshift({ID: "ALL_ACCOUNTS", Name: "All Accounts"});
            }
            bezl.vars.loading = false;
            bezl.dataService.Accounts = null;
            bezl.dataService.remove('Accounts');
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
