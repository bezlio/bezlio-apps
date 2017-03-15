define(["./customer.js"], function (customer) {
    function RunQuery (bezl, queryName) {

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
        customer.RunQuery(bezl, 'GetPartsByCustNum');

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
            require(['https://cdn.rawgit.com/bezlio/bezlio-apps/1.3/libraries/epicor/order.js'], function(functions) {
                functions.newOrder(bezl
                                , bezl.vars.selectedCustomer.Company
                                , bezl.vars.selectedCustomer.CustNum);
            }); 
        }
    }
    
    function SubmitOrder (bezl) {
        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://cdn.rawgit.com/bezlio/bezlio-apps/1.3/libraries/epicor/order.js'], function(functions) {
                functions.submitOrder(bezl, bezl.vars.selectedCustomer.Company);
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