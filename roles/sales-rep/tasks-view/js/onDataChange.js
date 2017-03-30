define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.TaskTypes && bezl.vars.selectedAccount.Tasks) {
            // Check to see if any tasks that were added before the task TaskTypes
            // came back need one filled in
            for (var i = 0; i < bezl.vars.selectedAccount.Tasks.length; i++) {
                if (bezl.vars.selectedAccount.Tasks[i].RowState == 'Added' && bezl.vars.selectedAccount.Tasks[i].TaskType == '') {
                    bezl.vars.selectedAccount.Tasks[i].TaskType = bezl.data.TaskTypes[0].TaskType;
                }
            }
        }

        if (bezl.data.UpdateTasks) {
            if (bezl.data.UpdateTasks.BOUpdError && bezl.data.UpdateTasks.BOUpdError.length > 0) {
                bezl.notificationService.showCriticalError(JSON.stringify(bezl.data.UpdateTasks.BOUpdError));
            } else {
                for (var i = 0; i < bezl.vars.selectedAccount.Tasks.length; i++) {
                    bezl.vars.selectedAccount.Tasks[i].RowState = '';
                }
                // Trigger the "updateTask" event for any bezls that need to know about the new/updated task
                $('.panel').trigger('updateTask', [bezl.vars.selectedAccount]);
            }

            bezl.data.UpdateTasks = null;
            bezl.dataService.remove('UpdateTasks');
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
