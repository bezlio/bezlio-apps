define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "TaskTypes":
                // Pull in the task types
                bezl.dataService.add('TaskTypes','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetTaskTypes",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "Tasks":
                bezl.vars.loading = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('Tasks','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountTasks",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser },
                        { "Key": "ID", "Value": bezl.vars.selectedAccount.ID }
                    ] },0);
                break;
            default:
                break;
        }
    }

    function Select(bezl, task) {
        task.Selected = !task.Selected;
    }

    function AddTask (bezl) {
        // Since alternate systems may require different columns for newly added tasks, direct to
        // the libraries folder
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://bezlio-apps.bezl.io/libraries/epicor/crm.js'], function(functions) {
                var taskType = '';
                if (bezl.data.TaskTypes) {
                    taskType = bezl.data.TaskTypes[0].TaskType;
                }

                bezl.vars.selectedAccount.Tasks.push(
                    functions.getNewTask(bezl.vars.selectedAccount.CustNum,
                                        bezl.vars.selectedAccount.SalesRep,
                                        taskType)
                );

                // Order the added tasks to the top
                bezl.vars.selectedAccount.Tasks.sort(function(a, b) {
                    if (a.RowState && a.RowState == 'Added') {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }); 
        }
    }

    function CancelAddTask (bezl, task) {
        for (var i = 0; i < bezl.vars.selectedAccount.Tasks.length; i++) {
            if (bezl.vars.selectedAccount.Tasks[i] == task) {
                bezl.vars.selectedAccount.Tasks.splice(i, 1);
                // Because we removed an item in the array we are iterating
                // over we need to decrement our current index by one
                i--;
            }
        }
    }

    function UpdateTasks (bezl) {
        // Since alternate systems may require different columns for newly added tasks, direct to
        // the libraries folder
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://bezlio-apps.bezl.io/libraries/epicor/crm.js'], function(functions) {
                functions.updateTasks(bezl,
                                        bezl.vars.selectedAccount.Tasks);

                bezl.notificationService.showSuccess('Task changes are being saved.  You will be notified if any errors occurs.');
            }); 
        }

        localStorage.setItem('selectedAccount', JSON.stringify(bezl.vars.selectedAccount));
    }

    return {
        runQuery: RunQuery,
        select: Select,
        addTask: AddTask,
        cancelAddTask: CancelAddTask,
        updateTasks: UpdateTasks
    }
});
