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
                    "QueryName": "GetAccountsContacts",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "CRMCalls":
                bezl.vars.loadingCalls = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('CRMCalls','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountsCallHistory",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "Tasks":
                bezl.vars.loadingTasks = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('Tasks','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountsTasks",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "Attachments":
                bezl.vars.loadingTasks = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('Attachments','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountsAttachments",
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

                if (bezl.data.Accounts[i].Selected) {
                    localStorage.setItem('selectedAccount', JSON.stringify(bezl.data.Accounts[i]));
                    $('.panel').trigger('selectAccount', [bezl.data.Accounts[i]]);
                } else {
                    localStorage.setItem('selectedAccount', '');
                    $('.panel').trigger('selectAccount', [{}]);
                }
                
            } else {
                bezl.data.Accounts[i].Selected = false;
            }
        };
    }

    function Sort(bezl, sortColumn) {

        // If the previous sort column was picked, make it the opposite sort
        if (bezl.vars.sortCol == sortColumn) {
            if (bezl.vars.sort == "desc") {
                bezl.vars.sort = "asc";
            } else {
                bezl.vars.sort = "desc";
            }
        } else {
            bezl.vars.sort = "asc";
        }
        
        // Store the sort column so the UI can reflect it
        bezl.vars.sortCol = sortColumn;


        // Test for numeric sort columns, otherwise sort alphabetic
        if (sortColumn == "Distance") {
            if (bezl.vars.sort == "asc") {
                bezl.data.Accounts.sort(function (a, b) {
                    var A = a[sortColumn] || Number.MAX_SAFE_INTEGER;
                    var B = b[sortColumn] || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.data.Accounts.sort(function (a, b) {
                    var A = a[sortColumn] || Number.MAX_SAFE_INTEGER;
                    var B = b[sortColumn] || Number.MAX_SAFE_INTEGER;
                    return B - A;
                });
            }
        } else if (sortColumn == "LastContact" || sortColumn == "NextTaskDue") {
            if (bezl.vars.sort == "asc") {
                bezl.data.Accounts.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.data.Accounts.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    return B - A;
                });
            } 
        } else {
            if (bezl.vars.sort == "asc") { 
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
            } else {
                bezl.data.Accounts.sort(function(a, b) {
                    var A = a[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    if (A > B) {
                        return -1;
                    }
                    if (A < B) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
            }
        }

    }

    function ApplyFilter(bezl) {
        for (var i = 0; i < bezl.data.Accounts.length; i++) {
		if (bezl.data.Accounts[i].Name.startsWith(bezl.vars.searchString)) {
			bezl.data.Accounts[i].show = true;
		}
		else {
			bezl.data.Accounts[i].show = false;
		}
	};
    }
  
    return {
        runQuery: RunQuery,
        select: Select,
        sort: Sort,
        applyFilter: ApplyFilter
    }
});
