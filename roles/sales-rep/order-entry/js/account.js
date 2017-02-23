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
        }
    }

    return {
        runQuery: RunQuery,
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
});