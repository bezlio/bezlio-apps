define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Invoices) {
            
            bezl.vars.Invoices = new Array();

            // If there was a previously selected Invoice in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedInvoice = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedInvoice")) {
                bezl.vars.selectedInvoice = JSON.parse(localStorage.getItem("selectedInvoice"));
            }

            var tempInvoice = {};
            var tempLine = {};
            
            // Organize new object
            for(var i = 0; i < bezl.data.Invoices.length; i++) {

                 //clear temps
                tempInvoice = {};
                tempLine = {};

                // If invoice num already exist in new object, move invoice lines over
                if (bezl.vars.Invoices.find(invoice => invoice.InvoiceNum == bezl.data.Invoices[i].InvoiceNum)) {
                    // Line
                    tempLine.InvoiceLine = bezl.data.Invoices[i].InvoiceLine || "";
                    tempLine.PartNum = bezl.data.Invoices[i].PartNum || "";
                    tempLine.PartDescription = bezl.data.Invoices[i].PartDescription || "";
                    tempLine.Qty = bezl.data.Invoices[i].Qty || "";
                    tempLine.UnitPrice = bezl.data.Invoices[i].UnitPrice || "";
                    tempLine.ExtPrice = bezl.data.Invoices[i].ExtPrice || "";
                    // Push line into invoice
                    bezl.vars.Invoices[bezl.vars.Invoices.findIndex(inv => inv.InvoiceNum == bezl.data.Invoices[i].InvoiceNum)].InvoiceLines.push(tempLine);
                } else {

                    // Invoice
                    tempInvoice.InvoiceNum = bezl.data.Invoices[i].InvoiceNum || "";
                    tempInvoice.InvoiceDate = bezl.data.Invoices[i].InvoiceDate || "";
                    tempInvoice.InvoiceAmt = bezl.data.Invoices[i].InvoiceAmt || "";
                    tempInvoice.InvoiceBal = bezl.data.Invoices[i].InvoiceBal || "";
                    tempInvoice.OrderDate = bezl.data.Invoices[i].OrderDate || "";
                    tempInvoice.PoNum = bezl.data.Invoices[i].PoNum || "";

                    // Add a Selected property to the account record
                    if (bezl.data.Invoices[i].InvoiceNum == bezl.vars.selectedInvoice.InvoiceNum) {
                        tempInvoice.Selected = true;
                    } else {
                        tempInvoice.Selected = false;
                    }

                    // Line
                    tempLine.InvoiceLine = bezl.data.Invoices[i].InvoiceLine || "";
                    tempLine.PartNum = bezl.data.Invoices[i].PartNum || "";
                    tempLine.PartDescription = bezl.data.Invoices[i].PartDescription || "";
                    tempLine.Qty = bezl.data.Invoices[i].Qty || "";
                    tempLine.UnitPrice = bezl.data.Invoices[i].UnitPrice || "";
                    tempLine.ExtPrice = bezl.data.Invoices[i].ExtPrice || "";
                    // Push line into invoice
                    tempInvoice.InvoiceLines = new Array();
                    tempInvoice.InvoiceLines.push(tempLine); 

                    // Push invoice into final data var
                    bezl.vars.Invoices.push(tempInvoice); 
                }
            }
            bezl.vars.loading = false;
    }
}

return {
        onDataChange: OnDataChange
    }
});