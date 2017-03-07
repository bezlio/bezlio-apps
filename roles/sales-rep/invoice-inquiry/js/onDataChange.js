define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Invoices) {
            bezl.vars.loading = false;

            // If there was a previously selected Invoice in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedInvoice = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedInvoice")) {
                bezl.vars.selectedInvoice = JSON.parse(localStorage.getItem("selectedInvoice"));
            }

            var tempLine = {};
            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.data.Invoices.length; i++) {
                // Add a Selected property to the account record
                if (bezl.data.Invoices[i].InvoiceNum == bezl.vars.selectedInvoice.InvoiceNum) {
                    bezl.data.Invoices[i].Selected = true;
                } else {
                    bezl.data.Invoices[i].Selected = false;
                }
                // Make the InvoiceLine an array
                tempLine.InvoiceLine = bezl.data.Invoices[i].InvoiceLine;
                tempLine.PartNum = bezl.data.Invoices[i].PartNum;
                tempLine.PartDescrition = bezl.data.Invoices[i].PartDescrition;
                tempLine.Qty = bezl.data.Invoices[i].Qty;
                tempLine.UnitPrice = bezl.data.Invoices[i].UnitPrice;
                tempLine.ExtPrice = bezl.data.Invoices[i].ExtPrice;
                bezl.data.Invoices[i].InvoiceLines = new Array();
                bezl.data.Invoices[i].InvoiceLines.push(tempLine); 
                //remove old 'line'
                delete bezl.data.Invoices[i].InvoiceLine;
                delete bezl.data.Invoices[i].PartNum;
                delete bezl.data.Invoices[i].PartDescrition;
                delete bezl.data.Invoices[i].Qty;
                delete bezl.data.Invoices[i].UnitPrice;
                delete bezl.data.Invoices[i].ExtPrice;
        }

        // Place the same invoice numbers together 
        // sort by invoice number
         bezl.data.Invoices.sort(function (a, b) {
                    var A = a['InvoiceNum'] || Number.MAX_SAFE_INTEGER;
                    var B = b['InvoiceNum'] || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
         // group invoices together
        var previousInvoice = {};
         for (var i = 0; i < bezl.data.Invoices.length; i++) {
                if (previousInvoice.InvoiceNum == bezl.date.Invoices[i].InvoiceNum) {
                    for (var j = 0; j < previousInvoice.InvoiceLines.length; j++){
                        bezl.data.Invoices[i].InvoicesLines.push(previousInvoice.InvoiceLines[j]);
                    }
                } 
            } 
         previousInvoice = bezl.date.Invoices[i];    

    }
    }

return {
        onDataChange: OnDataChange
    }
});