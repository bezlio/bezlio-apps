define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Tasks) {
            bezl.vars.loading = false;
            bezl.vars.selectedAccount.Tasks = bezl.data.Tasks;
        }

        if (bezl.data.UpdateTasks) {
            if (bezl.data.UpdateTasks.BOUpdError && bezl.data.UpdateTasks.BOUpdError.length > 0) {
                bezl.notificationService.showCriticalError(JSON.stringify(bezl.data.UpdateTasks.BOUpdError));
            } else {
                bezl.notificationService.showSuccess('Tasks Saved');
            }

            bezl.data.UpdateTasks = null;
            bezl.dataService.remove('UpdateTasks');
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});