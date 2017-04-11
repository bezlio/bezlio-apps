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
            BasePrice: basePrice,
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
            require(['https://bezlio-apps.bezl.io/libraries/epicor/order.js'], function(functions) {
                functions.newOrder(bezl);
            }); 
        } else if (bezl.vars.Platform == "Visual8") {
            require(['https://bezlio-apps.bezl.io/libraries/visual8/order.js'], function(functions) {
                functions.newOrder(bezl);
            }); 
        }
    }

    function QtyChange (bezl) {
        bezl.vars.orderTotal = 0;
        // Find out if we have hit a quantity break discount
        bezl.vars.partList.forEach(p => {
        var disc = bezl.vars.partDiscounts.filter(pd => pd.PartNum == p.PartNum);
        
        for (var i = 0; i < disc.length; i++) {
            if (p.Qty >= disc[i].GroupQty) {
            if (disc[i].GroupDiscount != null && disc[i].GroupDiscount != 0) {
                var discPrice = ((100 - disc[i].GroupDiscount)/100) * p.BasePrice;
                if (p.UnitPrice > discPrice) {
                p.UnitPrice = discPrice;
                }
            }
            if (disc[i].GroupPrice != null && disc[i].GroupPrice != 0) {
                if (p.UnitPrice > disc[i].GroupPrice) {
                p.UnitPrice = disc[i].GroupPrice;
                }
            }
            }
            if (p.Qty >= disc[i].PartQty) {
            if (disc[i].PartDiscount != null && disc[i].PartDiscount != 0) {
                var discPrice = ((100 - disc[i].PartDiscount)/100) * p.BasePrice;
                if (p.UnitPrice > discPrice) {
                p.UnitPrice = discPrice;
                }
            }
            if (disc[i].PartPrice != null && disc[i].PartPrice != 0) {
                if (p.UnitPrice > disc[i].PartPrice) {
                p.UnitPrice = disc[i].PartPrice;
                }
            }
            }
        }
        bezl.vars.orderTotal += p.Qty * p.UnitPrice;
        });
    }
    
    function SubmitOrder (bezl) {
        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.Platform == "Epicor10" || bezl.vars.Platform == "Epicor905") {
            require(['https://bezlio-apps.bezl.io/libraries/epicor/order.js'], function(functions) {
                functions.submitOrder(bezl);
            }); 
        } else if (bezl.vars.Platform == "Visual8") {
            require(['https://bezlio-apps.bezl.io/libraries/visual8/order.js'], function(functions) {
                functions.submitOrder(bezl);
            }); 
        }
    }

    function ClearOrder (bezl) {
        // Clears the order to add a new order
        bezl.vars.partList = [];
        bezl.vars.orderTotal = 0;
        bezl.vars.CustomerID = '';
        bezl.vars.selectedCustomer = {};
        bezl.vars.selectedShipTo = {};
        bezl.vars.OrderDate = new Date();
        bezl.vars.PONumber = null;
        bezl.vars.NeedBy = null;
        bezl.vars.ShipBy = null;
        bezl.vars.ShipVia = null;
        bezl.vars.OrderComment = null;
        bezl.vars.NotifyEmail = null;

        bezl.vars.submittedOrder = false;
    }

    return {
        runQuery: RunQuery,
        addLine: AddLine,
        clearOrder: ClearOrder,
        newOrder: NewOrder,
        qtyChange: QtyChange,
        submitOrder: SubmitOrder
    }
});