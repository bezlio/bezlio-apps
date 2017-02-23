define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Tasks) {
            bezl.vars.loading = false;
            bezl.vars.selectedAccount.Tasks = bezl.data.Tasks;
        }

        if (bezl.data.UpdateTasks) {
            bezl.notificationService.showSuccess(JSON.stringify(bezl.data.UpdateTasks));
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});