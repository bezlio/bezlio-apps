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

        //if (bezl.data.AllCRMCalls && bezl.vars.loadingAllCalls) {
        if (bezl.data.AllCRMCalls) {
            //bezl.vars.loadingAllCalls = false;

            // Set the currently selected accounts call data
            if (bezl.vars.selectedAccount) {
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
    }
  
    return {
        onDataChange: OnDataChange
    }
});
