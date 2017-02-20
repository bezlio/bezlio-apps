define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "Accounts":
                bezl.vars.loading = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('Accounts','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccounts",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "AccountContacts":
                bezl.vars.loadingContacts = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('AccountContacts','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountContacts",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            default:
                break;
        }
    }

    function Select(bezl, account) {
        // Mark the selected customer as selected
        for (var i = 0; i < bezl.data.Accounts.length; i++) {
            if (bezl.data.Accounts[i].ID == account.ID) {
                bezl.data.Accounts[i].Selected = !bezl.data.Accounts[i].Selected;
            } else {
                bezl.data.Accounts[i].Selected = false;
            }
        };
    }

    function Sort(bezl, sortColumn) {
        // Test for numeric sort columns, otherwise sort alphabetic
        if (sortColumn == "Distance") {
            bezl.data.Accounts.sort(function (a, b) {
                return a[sortColumn] - b[sortColumn];
            });
        } else {
            bezl.data.Accounts.sort(function(a, b) {
                var A = a[sortColumn] .toUpperCase(); // ignore upper and lowercase
                var B = b[sortColumn] .toUpperCase(); // ignore upper and lowercase
                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
        }

    }
  
    return {
        runQuery: RunQuery,
        select: Select,
        sort: Sort
    }
});