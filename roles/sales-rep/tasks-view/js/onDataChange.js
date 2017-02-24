define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.TaskTypes) {
            // Check to see if any tasks that were added before the task TaskTypes
            // came back need one filled in
            for (var i = 0; i < bezl.vars.selectedAccount.Tasks.length; i++) {
                if (bezl.vars.selectedAccount.Tasks[i].RowState == 'Added' && bezl.vars.selectedAccount.Tasks[i].TaskType == '') {
                    bezl.vars.selectedAccount.Tasks[i].TaskType[0].TaskType;
                }
            }
        }

        if (bezl.data.UpdateTasks) {
            if (bezl.data.UpdateTasks.BOUpdError && bezl.data.UpdateTasks.BOUpdError.length > 0) {
                bezl.notificationService.showCriticalError(JSON.stringify(bezl.data.UpdateTasks.BOUpdError));
            }

            bezl.data.UpdateTasks = null;
            bezl.dataService.remove('UpdateTasks');
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});