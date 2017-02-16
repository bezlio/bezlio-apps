define(["./customer.js"], function (customer) {
 
    function OnDataChange (bezl) {
        if (bezl.data.CustList) {
            bezl.vars.loading = false;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});