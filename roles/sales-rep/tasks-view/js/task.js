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
        task.Selected = true;
        // Mark the selected customer as selected
        // for (var i = 0; i < bezl.vars.selectedAccount.Tasks.length; i++) {
        //     if (bezl.data.Accounts[i].ID == account.ID) {
        //         bezl.data.Accounts[i].Selected = !bezl.data.Accounts[i].Selected;

        //         if (bezl.data.Accounts[i].Selected) {
        //             localStorage.setItem('selectedAccount', JSON.stringify(bezl.data.Accounts[i]));
        //             $('.panel').trigger('selectAccount', [bezl.data.Accounts[i]]);
        //         } else {
        //             localStorage.setItem('selectedAccount', '');
        //             $('.panel').trigger('selectAccount', [{}]);
        //         }
                
        //     } else {
        //         bezl.data.Accounts[i].Selected = false;
        //     }
        // };
    }

    return {
        runQuery: RunQuery,
        select: Select
    }
});