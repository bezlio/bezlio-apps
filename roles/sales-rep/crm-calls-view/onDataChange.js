define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.CRMCalls) {
            bezl.vars.loading = false;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});