define(["./customer.js"], function (customer) {
    function RunQuery (bezl, queryName) {

    }

    function AddLine (bezl) {
        // See if we have a different base price we need to use
        var basePrice = bezl.vars.selectedPart.UnitPrice;

        var disc = bezl.vars.partDiscounts.filter(p => p.PartNum == bezl.vars.selectedPart.PartNum);

        if (disc.length > 0) {
            // We will just pick the first because this is not qty based
            if (disc[0].GroupBasePrice != null && disc[0].GroupBasePrice != 0) {
                basePrice = disc[0].GroupBasePrice;
            }

            if (disc[0].PartBasePrice != null && disc[0].PartBasePrice != 0) {
                basePrice = disc[0].PartBasePrice;
            }
        }

        bezl.vars.partList.push({
            PartNum: bezl.vars.selectedPart.PartNum,
            PartDescription: bezl.vars.selectedPart.PartDescription, 
            Qty: 0,
            UOM: bezl.vars.selectedPart.UOM, 
            QtyOnHand: bezl.vars.selectedPart.QOH,
            UnitPrice: basePrice,
            Comment: ''
        });
        bezl.vars.selectedPart = null;
        $(bezl.container.nativeElement).find(".partList").val('');
        $(bezl.container.nativeElement).find(".partList").trigger('input.typeahead');
    }

    function NewOrder (bezl) {
        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://cdn.rawgit.com/bezlio/bezlio-apps/1.6/libraries/epicor/order.js'], function(functions) {
                functions.newOrder(bezl);
            }); 
        }
    }
    
    function SubmitOrder (bezl) {
        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://cdn.rawgit.com/bezlio/bezlio-apps/1.6/libraries/epicor/order.js'], function(functions) {
                functions.submitOrder(bezl);
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