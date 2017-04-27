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
            case "GetPartsByCustNum":
                bezl.vars.loadingParts = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('GetPartsByCustNum','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetPartsByCustNum",
                    "Parameters": [
                        { "Key": "CustNum", "Value": bezl.vars.selectedAccount.CustNum }
                    ] },0);
                break;
        }
    }
  
    function Select(bezl, account) {
        // Dropdown only allows single selecting
        // Mark all of them as not selected
        bezl.data.Accounts.forEach(a => a.Selected = false);
        bezl.vars.selectedShipTo = null;

        // Select the one we selected
        bezl.vars.selectedAccount = bezl.data.Accounts.find(a => a.ID == account.ID);
        bezl.vars.selectedAccount.Selected = true;

        // Run our query to load parts
        RunQuery(bezl, 'GetPartsByCustNum');

        // Load a new Order
        NewOrder(bezl);

        localStorage.setItem('selectedAccount', JSON.stringify(bezl.vars.selectedAccount));
        $('.panel').trigger('selectAccount', [bezl.vars.selectedAccount]);

        // Filter our contacts
        bezl.vars.filteredContacts = bezl.data.AccountContacts.filter(c => c.ID == account.ID);

        // Filter out shiptos
        bezl.vars.filteredShipTos = bezl.data.AccountShipTos.filter(st => st.ID == account.ID);
    }

    function SelectShipTo(bezl, shipto) {
        // Dropdown only allows single selecting
        // Mark all of them as not selected
        bezl.data.AccountShipTos.forEach(a => a.Selected = false);
        bezl.vars.selectedShipTo = bezl.data.AccountShipTos.find(st => st.ID == shipto.ID && st.ShipToNum == shipto.ShipToNum);
        bezl.vars.selectedShipTo.Selected = true;
    }

    function AddLine (bezl) {
        bezl.vars.partList.push({
            PartNum: bezl.vars.selectedPart.PartNum,
            PartDescription: bezl.vars.selectedPart.PartDescription, 
            Qty: 0,
            UOM: bezl.vars.selectedPart.IUM, 
            QtyOnHand: bezl.vars.selectedPart.OnHandQty,
            UnitPrice: bezl.vars.selectedPart.BasePrice,
            Comment: ''
        });
        $(bezl.container.nativeElement).find(".partList").typeahead('setQuery', '');
    }

    function NewOrder (bezl) {
        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://rawgit.com/bezlio/bezlio-apps/development/libraries/epicor/order.js'], function(functions) {
                functions.newOrder(bezl
                                , bezl.vars.selectedAccount.Company
                                , bezl.vars.selectedAccount.CustNum);
            }); 
        }
    }
    
    function SubmitOrder (bezl) {
        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://rawgit.com/bezlio/bezlio-apps/development/libraries/epicor/order.js'], function(functions) {
                functions.submitOrder(bezl, bezl.vars.selectedAccount.Company);
            }); 
        }
    }

    return {
        runQuery: RunQuery,
        select: Select,
        selectShipTo: SelectShipTo,
        addLine: AddLine,
        newOrder: NewOrder,
        submitOrder: SubmitOrder
    }
});