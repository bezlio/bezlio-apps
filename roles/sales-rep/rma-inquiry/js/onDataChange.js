define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.RMAs) {
            
            bezl.vars.RMAs = new Array();

            // If there was a previously selected RMA in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedRMA = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedRMA")) {
                bezl.vars.selectedRMA = JSON.parse(localStorage.getItem("selectedRMA"));
            }

            var tempRMA = {};
            var tempLine = {};
            
            // Organize new object
            for(var i = 0; i < bezl.data.RMAs.length; i++) {

                 //clear temps
                tempRMA = {};
                tempLine = {};
                tempOrder = {};

                // If RMA num already exist in new object, move RMA lines over
                if (bezl.vars.RMAs.find(rma => rma.RMANum == bezl.data.RMAs[i].RMANum)) {
                    
                   if (bezl.vars.RMAs.find(rma => rma.RMANum.OrderNum == bezl.data.RMAs[i].RMANum.OrderNum)) {
                    // order
                    tempOrder.OrderNum = bezl.data.RMAs[i].OrderNum;
                    tempOrder.OrderLine = bezl.data.RMAs[i].OrderLine;
                    tempOrder.OrderRelNum = bezl.data.RMAs[i].OrderRelNum;
                    tempOrder.PartNum = bezl.data.RMAs[i].PartNum;
                    tempOrder.RevNum = bezl.data.RMAs[i].RevNum;
                    tempOrder.LineDesc = bezl.data.RMAs[i].LineDesc;
                    tempOrder.ReturnQty = bezl.data.RMAs[i].ReturnQty;
                    tempOrder.ReasonDesc = bezl.data.RMAs[i].ReasonDesc;

                    // Line
                    tempLine.RMALine = bezl.data.RMAs[i].RMALine;

                     // Push order into Line
                    bezl.vars.RMAs[bezl.vars.RMAs.findIndex(inv => inv.RMANum.OrderNum == bezl.data.RMAs[i].RMANum.OrderNum)].LineOrders.push(tempOrder);

                    // Push line into RMA
                    bezl.vars.RMAs[bezl.vars.RMAs.findIndex(inv => inv.RMANum == bezl.data.RMAs[i].RMANum)].RMALines.push(tempLine);
                   }
                } else {

                    // RMA
                    tempRMA.RMANum = bezl.data.RMAs[i].RMANum;
                    tempRMA.RMADate = bezl.data.RMAs[i].RMADate;
                    tempRMA.CustName = bezl.data.RMAs[i].CustName;
                    tempRMA.ContactName = bezl.data.RMAs[i].ContactName;

                    // Add a Selected property to the account record
                    if (bezl.data.RMAs[i].RMANum == bezl.vars.selectedRMA.RMANum) {
                        tempRMA.Selected = true;
                    } else {
                        tempRMA.Selected = false;
                    }

                    // order
                    tempOrder.OrderNum = bezl.data.RMAs[i].OrderNum;
                    tempOrder.OrderLine = bezl.data.RMAs[i].OrderLine;
                    tempOrder.OrderRelNum = bezl.data.RMAs[i].OrderRelNum;
                    tempOrder.PartNum = bezl.data.RMAs[i].PartNum;
                    tempOrder.RevNum = bezl.data.RMAs[i].RevNum;
                    tempOrder.LineDesc = bezl.data.RMAs[i].LineDesc;
                    tempOrder.ReturnQty = bezl.data.RMAs[i].ReturnQty;
                    tempOrder.ReasonDesc = bezl.data.RMAs[i].ReasonDesc;

                    // Line
                    tempLine.RMALine = bezl.data.RMAs[i].RMALine;

                    // Push Order into line
                    tempLine.LineOrders = new Array();
                    tempLine.LineOrders.push(tempOrder);

                    // Push line into RMA
                    tempRMA.RMALines = new Array();
                    tempRMA.RMALines.push(tempLine); 

                    // Push RMA into final data var
                    bezl.vars.RMAs.push(tempRMA); 
                }
            }
            bezl.vars.loading = false;
    }
}

return {
        onDataChange: OnDataChange
    }
});