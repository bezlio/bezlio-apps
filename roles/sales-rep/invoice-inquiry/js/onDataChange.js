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

            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.data.Invoices.length; i++) {
                // Add a Selected property to the account record
                if (bezl.data.Invoices[i].ID == bezl.vars.selectedInvoice.ID) {
                    bezl.data.Invoices[i].Selected = true;
                } else {
                    bezl.data.Invoices[i].Selected = false;
                }
        }
    }
    }

return {
        onDataChange: OnDataChange
    }
});