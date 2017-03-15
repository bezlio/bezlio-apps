define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "Customers":
                bezl.vars.loading = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('Customers','brdb','customer-portal-queries','ExecuteQuery', { 
                    "QueryName": "/order-entry/GetCustomers",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "CustomersContacts":
                bezl.vars.loadingContacts = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('CustomersContacts','brdb','customer-portal-queries','ExecuteQuery', { 
                    "QueryName": "/order-entry/GetCustomersContacts",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "CustomersShipTos":
                bezl.vars.loadingShipTos = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('CustomersShipTos','brdb','customer-portal-queries','ExecuteQuery', { 
                    "QueryName": "/order-entry/GetCustomersShipTos",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "GetGlobalParts":
                bezl.vars.loadingParts = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('GetGlobalParts','brdb','customer-portal-queries','ExecuteQuery', { 
                    "QueryName": "/order-entry/GetGlobalParts",
                    "Parameters": [] },0);
                break;
            case "GetPartsByCustNum":
                bezl.vars.loadingParts = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('GetPartsByCustNum','brdb','customer-portal-queries','ExecuteQuery', { 
                    "QueryName": "/order-entry/GetPartsByCustNum",
                    "Parameters": [
                        { "Key": "CustNum", "Value": bezl.vars.selectedCustomer.CustNum }
                    ] },0);
                break;
        }
    }

    function Select(bezl, account) {
        // Dropdown only allows single selecting
        // Mark all of them as not selected
        bezl.data.Customers.forEach(a => a.Selected = false);
        bezl.vars.selectedShipTo = null;

        // Select the one we selected
        bezl.vars.selectedCustomer = bezl.data.Customers.find(a => a.ID == account.ID);
        bezl.vars.selectedCustomer.Selected = true;

        // Run our query to load parts
        RunQuery(bezl, 'GetPartsByCustNum');

        // Load a new Order
        NewOrder(bezl);

        //localStorage.setItem('selectedAccount', JSON.stringify(bezl.vars.selectedAccount));
        //$('.panel').trigger('selectAccount', [bezl.vars.selectedAccount]);

        // Filter our contacts
        bezl.vars.filteredContacts = bezl.data.CustomersContacts.filter(c => c.ID == account.ID);

        // Filter out shiptos
        bezl.vars.filteredShipTos = bezl.data.CustomersShipTos.filter(st => st.ID == account.ID);
    }

    function SelectShipTo(bezl, shipto) {
        // Dropdown only allows single selecting
        // Mark all of them as not selected
        bezl.data.CustomersShipTos.forEach(a => a.Selected = false);
        bezl.vars.selectedShipTo = bezl.data.CustomersShipTos.find(st => st.ID == shipto.ID && st.ShipToNum == shipto.ShipToNum);
        bezl.vars.selectedShipTo.Selected = true;
    }

    return {
        runQuery: RunQuery,
        select: Select,
        selectShipTo: SelectShipTo,
    }
});