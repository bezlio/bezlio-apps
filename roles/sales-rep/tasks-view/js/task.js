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
            require(['https://cdn.rawgit.com/bezlio/bezlio-apps/1.3/libraries/epicor/crm.js'], function(functions) {
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

    function UpdateTasks (bezl) {
        // Since alternate systems may require different columns for newly added tasks, direct to
        // the libraries folder
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://cdn.rawgit.com/bezlio/bezlio-apps/1.3/libraries/epicor/crm.js'], function(functions) {
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
        updateTasks: UpdateTasks
    }
});