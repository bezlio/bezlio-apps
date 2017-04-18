define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.PriceList) {
            
            bezl.vars.PriceList = new Array();

            // If there was a previously selected PArt in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedPart = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedPart")) {
                bezl.vars.selectedPart = JSON.parse(localStorage.getItem("selectedPart"));
            }

            var tempPart = {};
            var tempLine = {};
            
            // Organize new object
            for(var i = 0; i < bezl.data.PriceList.length; i++) {

                 //clear temps
                tempPart = {};
                tempLine = {};

                // If invoice num already exist in new object, move invoice lines over
                if (bezl.vars.PriceList.find(invoice => invoice.PartNum == bezl.data.PriceList[i].PartNum)) {
                    // Line
                    tempLine.PriceBreakUnitPrice = bezl.data.PriceList[i].PriceBreakUnitPrice;
                    tempLine.Quantity = bezl.data.PriceList[i].Quantity;
                    // Push line into invoice
                    bezl.vars.PriceList[bezl.vars.PriceList.findIndex(inv => inv.PartNum == bezl.data.PriceList[i].PartNum)].PartLines.push(tempLine);
                } else {

                    // Part
                    tempPart.PartNum = bezl.data.PriceList[i].PartNum || "";
                    tempPart.PartDescription = bezl.data.PriceList[i].PartDescription || "";
                    tempPart.StartDate = bezl.data.PriceList[i].StartDate || "";
                    tempPart.EndDate = bezl.data.PriceList[i].EndDate || "";
                    tempPart.BasePrice = bezl.data.PriceList[i].BasePrice;

                    // Add a Selected property to the account record
                    if (bezl.data.PriceList[i].PartNum == bezl.vars.selectedPart.PartNum) {
                        tempPart.Selected = true;
                    } else {
                        tempPart.Selected = false;
                    }

                    // Line
                    tempLine.PriceBreakUnitPrice = bezl.data.PriceList[i].PriceBreakUnitPrice;
                    tempLine.Quantity = bezl.data.PriceList[i].Quantity;
                    // Push line into invoice
                    tempPart.PartLines = new Array();
                    tempPart.PartLines.push(tempLine); 

                    // Push invoice into final data var
                    bezl.vars.PriceList.push(tempPart); 
                }
            }
            bezl.dataService.remove('PriceList');
            bezl.data.PriceList = null;
            bezl.vars.loading = false;
    }
}

return {
        onDataChange: OnDataChange
    }
});