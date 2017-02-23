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
            case "AccountShipTos":
                bezl.vars.loadingShipTos = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('AccountShipTos','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountsShipTos",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
        }
    }
  
    function Select(bezl, account) {
        // Dropdown only allows single selecting
        // Mark all of them as not selected
        bezl.data.Accounts.forEach(a => a.Selected = false);

        // Select the one we selected
        var selectedAcct = bezl.data.Accounts.find(a => a.ID == account.ID).Selected = true;
        localStorage.setItem('selectedAccount', JSON.stringify(selectedAcct));
        $('.panel').trigger('selectAccount', [selectedAcct]);

        // Filter our account
        bezl.vars.filteredAccount = bezl.data.Account.filter(a => a.ID == account.ID);
        
        // Filter our contacts
        bezl.vars.filteredContacts = bezl.data.AccountContacts.filter(c => c.ID == account.ID);

        // Filter out shiptos
        bezl.vars.filteredShipTos = bezl.data.AccountShipTos.filter(st => st.ID == account.ID);
    }
    
    return {
        runQuery: RunQuery,
        select: Select
    }
});