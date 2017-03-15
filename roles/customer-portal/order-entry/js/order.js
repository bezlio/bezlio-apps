define(["./customer.js"], function (customer) {
    function RunQuery (bezl, queryName) {

    }

    function AddLine (bezl) {
        bezl.vars.partList.push({
            PartNum: bezl.vars.selectedPart.PartNum,
            PartDescription: bezl.vars.selectedPart.PartDescription, 
            Qty: 0,
            UOM: bezl.vars.selectedPart.UOM, 
            QtyOnHand: bezl.vars.selectedPart.QOH,
            UnitPrice: bezl.vars.selectedPart.UnitPrice,
            Comment: ''
        });
        $(bezl.container.nativeElement).find(".partList").typeahead('setQuery', '');
    }

    function NewOrder (bezl) {
        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://cdn.rawgit.com/bezlio/bezlio-apps/1.5/libraries/epicor/order.js'], function(functions) {
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
            require(['https://cdn.rawgit.com/bezlio/bezlio-apps/1.5/libraries/epicor/order.js'], function(functions) {
                functions.submitOrder(bezl, bezl.vars.selectedAccount.Company);
            }); 
        }
    }

    return {
        runQuery: RunQuery,
        addLine: AddLine,
        newOrder: NewOrder,
        submitOrder: SubmitOrder
    }
});