define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Orders) {
            
            bezl.vars.Orders = new Array();

            // If there was a previously selected Order in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedOrder = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedOrder")) {
                bezl.vars.selectedOrder = JSON.parse(localStorage.getItem("selectedOrder"));
            }

            var tempOrder = {};
            var tempLine = {};
            
            // Organize new object
            for(var i = 0; i < bezl.data.Orders.length; i++) {

                 //clear temps
                tempOrder = {};
                tempLine = {};

                // If Order num already exist in new object, move Order lines over
                if (bezl.vars.Orders.find(order => order.OrderNum == bezl.data.Orders[i].OrderNum)) {
                    // Line
                    tempLine.OrderLine = bezl.data.Orders[i].OrderLine;
                    tempLine.PartNum = bezl.data.Orders[i].PartNum;
                    tempLine.PartDesc = bezl.data.Orders[i].PartDesc;
                    tempLine.OrderQty = bezl.data.Orders[i].OrderQty;
                    tempLine.UnitPrice = bezl.data.Orders[i].UnitPrice;
                    tempLine.ExtPrice = bezl.data.Orders[i].ExtPrice;
                    tempLine.ShippedQty = bezl.data.Orders[i].ShippedQty;
                    // Push line into order
                    bezl.vars.Orders[bezl.vars.Orders.findIndex(ord => ord.OrderNum == bezl.data.Orders[i].OrderNum)].OrderLines.push(tempLine);
                } else {

                    // Order
                    tempOrder.OrderNum = bezl.data.Orders[i].OrderNum || "";
                    tempOrder.PoNum = bezl.data.Orders[i].PoNum || "";
                    tempOrder.OrderDate = bezl.data.Orders[i].OrderDate;
                    tempOrder.OrderAmt = bezl.data.Orders[i].OrderAmt;
                    tempOrder.OpenOrder = bezl.data.Orders[i].OpenOrder;

                    // Add a Selected property to the account record
                    if (bezl.data.Orders[i].OrderNum == bezl.vars.selectedOrder.OrderNum) {
                        tempOrder.Selected = true;
                    } else {
                        tempOrder.Selected = false;
                    }

                    // Line
                    tempLine.OrderLine = bezl.data.Orders[i].OrderLine;
                    tempLine.PartNum = bezl.data.Orders[i].PartNum;
                    tempLine.PartDesc = bezl.data.Orders[i].PartDesc;
                    tempLine.OrderQty = bezl.data.Orders[i].OrderQty;
                    tempLine.UnitPrice = bezl.data.Orders[i].UnitPrice;
                    tempLine.ExtPrice = bezl.data.Orders[i].ExtPrice;
                    tempLine.ShippedQty = bezl.data.Orders[i].ShippedQty;
                    // Push line into order
                    tempOrder.OrderLines = new Array();
                    tempOrder.OrderLines.push(tempLine); 

                    // Push order into final data var
                    bezl.vars.Orders.push(tempOrder); 
                }
            }
            // Show filter for data
            $("#Filter").show();
            bezl.vars.loading = false;
    }
}

return {
        onDataChange: OnDataChange
    }
});