define(["./task.js"], function (task) {

    function OnDataChange(bezl) {
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
                // changed to be updated so all new tasks will be ready for individual saving
                for (var i = 0; i < bezl.vars.selectedAccount.Tasks.length; i++) {
                    bezl.vars.selectedAccount.Tasks[i].RowState = 'Updated';
                }
                // Trigger the "updateTask" event for any bezls that need to know about the new/updated task
                $('#bezlpanel').trigger('updateTask', [bezl.vars.selectedAccount]);

                localStorage.setItem('selectedAccount', JSON.stringify(bezl.vars.selectedAccount));
            }

            bezl.data.UpdateTasks = null;
            bezl.dataService.remove('UpdateTasks');

            task.runQuery(bezl, 'Tasks');
        }

        //added ability to refresh tasks from Epicor side
        if (bezl.data.Tasks) {
            bezl.vars.selectedAccount.Tasks = [];
            bezl.data.Tasks.forEach(task => {
                task.RowState = "Updated";
                console.log(task);
                task.StartDate = task.StartDate.split('T')[0];
                bezl.vars.selectedAccount.Tasks.push(task);
            });

            localStorage.setItem('selectedAccount', JSON.stringify(bezl.vars.selectedAccount));

            bezl.dataService.remove('Tasks');
            bezl.vars.saving = false;
        }
    }

    return {
        onDataChange: OnDataChange
    }
});
