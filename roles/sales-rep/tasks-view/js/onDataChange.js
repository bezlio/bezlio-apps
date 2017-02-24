define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Tasks) {
            bezl.vars.loading = false;
            bezl.vars.selectedAccount.Tasks = bezl.data.Tasks;
        }

        if (bezl.data.TaskTypes && bezl.data.Tasks) {
            // Check to see if any tasks that were added before the task TaskTypes
            // came back need one filled in
            for (var i = 0; i < bezl.data.Tasks.length; i++) {
                if (bezl.data.Tasks[i].RowState == 'Added' && bezl.data.Tasks[i].TaskType == '') {
                    bezl.data.Tasks[i].TaskType[0].TaskType;
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