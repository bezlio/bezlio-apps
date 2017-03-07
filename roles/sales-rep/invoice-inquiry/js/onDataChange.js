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

            var tempInvoice = {};
            var tempLine = {};
            bezl.vars.Invoices = new Array();
            // Organize new object
            for(var i = 0; i < bezl.data.Invoices.length; i++) {

                 //clear temps
                tempInvoice = {};
                tempLine = {};

                // If invoice num already exist in new object, move invoice lines over
                if (bezl.vars.Invoices.find(i.InvoiceNum == bezl.data.Invoice[i])) {
                    console.log(bezl.data.Invoice[i]);
                }


                // Invoice
                tempInvoice.InvoiceNum = bezl.data.Invoices[i].InvoiceNum;
                tempInvoice.InvoiceDate = bezl.data.Invoices[i].InvoiceDate;
                tempInvoice.InvoiceAmt = bezl.data.Invoices[i].InvoiceAmt;
                tempInvoice.InvoiceBal = bezl.data.Invoices[i].InvoiceBal;
                tempInvoice.OrderDate = bezl.data.Invoices[i].OrderDate;
                tempInvoice.PoNum = bezl.data.Invoices[i].PoNum;
                tempInvoice.Company = bezl.data.Invoices[i].Company;

                // Add a Selected property to the account record
                if (bezl.data.Invoices[i].InvoiceNum == bezl.vars.selectedInvoice.InvoiceNum) {
                    tempInvoice.Selected = true;
                } else {
                    tempInvoice.Selected = false;
                }

                // Line
                tempLine.InvoiceLine = bezl.data.Invoices[i].InvoiceLine;
                tempLine.PartNum = bezl.data.Invoices[i].PartNum;
                tempLine.PartDescription = bezl.data.Invoices[i].PartDescription;
                tempLine.Qty = bezl.data.Invoices[i].Qty;
                tempLine.UnitPrice = bezl.data.Invoices[i].UnitPrice;
                tempLine.ExtPrice = bezl.data.Invoices[i].ExtPrice;
                // Push line into invoice
                tempInvoice.InvoiceLines = new Array();
                tempInvoice.InvoiceLines.push(tempLine); 

                // Push invoice into final data var
                bezl.vars.Invoices.push(tempInvoice); 
            }

            /*var tempLine = {};
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
        previousInvoice.InvoiceNum = 0;
         for (var i = 0; i < bezl.data.Invoices.length; i++) {
                if (previousInvoice.InvoiceNum == bezl.data.Invoices[i].InvoiceNum) {
                    for (var j = 0; j < previousInvoice.InvoiceLines.length; j++){
                        bezl.data.Invoices[i].InvoicesLines.push(previousInvoice.InvoiceLines[j]);
                    }
                } 
            } 
         previousInvoice = bezl.date.Invoices[i];    */

    }
}

return {
        onDataChange: OnDataChange
    }
});