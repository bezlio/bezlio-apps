define(["./order.js"], function (order) {
 
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
                bezl.vars.loadingGlobalParts = true; 

                // Pull in the global parts
                bezl.dataService.add('GetGlobalParts','brdb','customer-portal-queries','ExecuteQuery', { 
                    "QueryName": "/order-entry/GetGlobalParts",
                    "Parameters": [] },0);
                break;
            case "GetPartDiscounts":
                bezl.vars.loadingParts = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('GetPartDiscounts','brdb','customer-portal-queries','ExecuteQuery', { 
                    "QueryName": "/order-entry/GetPartDiscounts",
                    "Parameters": [
                        { "Key": "CustNum", "Value": bezl.vars.selectedCustomer.CustNum }
                    ] },0);
                break;
            case "GetShipVias":
                bezl.vars.loadingShipVias = true; 

                // Pull in the ship vias
                bezl.dataService.add('GetShipVias','brdb','customer-portal-queries','ExecuteQuery', { 
                    "QueryName": "/order-entry/GetShipVias",
                    "Parameters": [] },0);
                break;
        }
    }

    function Select(bezl, customer) {
        // Dropdown only allows single selecting
        // Mark all of them as not selected
        bezl.vars.Customers.forEach(a => a.Selected = false);
        bezl.vars.selectedShipTo = null;

        // Select the one we selected
        bezl.vars.selectedCustomer = bezl.vars.Customers.find(a => a.ID == customer.ID);
        bezl.vars.selectedCustomer.Selected = true;

        // Run our query to load parts
        RunQuery(bezl, 'GetPartDiscounts');

        // Load a new Order
        order.newOrder(bezl);
    }

    function SelectShipTo(bezl, shipto) {
        // Dropdown only allows single selecting
        // Mark all of them as not selected
        if (shipto) {
            bezl.vars.selectedCustomer.ShipTos.forEach(a => a.Selected = false);
            bezl.vars.selectedShipTo = bezl.vars.selectedCustomer.ShipTos.find(st => st.ID == shipto.ID && st.ShipToNum == shipto.ShipToNum);
            bezl.vars.selectedShipTo.Selected = true;
        }
    }

    return {
        runQuery: RunQuery,
        select: Select,
        selectShipTo: SelectShipTo,
    }
});