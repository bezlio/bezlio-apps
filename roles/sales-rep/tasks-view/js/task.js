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
            require(['https://rawgit.com/bezlio/bezlio-apps/development/libraries/epicor/crm.js'], function(functions) {
                bezl.vars.selectedAccount.Tasks.push(functions.getNewTask());
            }); 
        }
    }

    return {
        runQuery: RunQuery,
        select: Select,
        addTask: AddTask
    }
});