define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Invoices) {
            bezl.vars.loading = false;
            bezl.vars.invoices = bezl.data.Invoices;
        }
    }
    
return {
        onDataChange: OnDataChange
    }
});