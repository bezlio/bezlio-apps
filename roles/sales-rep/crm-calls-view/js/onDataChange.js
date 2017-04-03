define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.CRMCalls) {
            bezl.vars.loading = false;
            bezl.vars.selectedAccount.CRMCalls = bezl.data.CRMCalls;

            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.vars.selectedAccount.CRMCalls.length; i++) {
                bezl.vars.selectedAccount.CRMCalls[i].show = true;
            }
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
