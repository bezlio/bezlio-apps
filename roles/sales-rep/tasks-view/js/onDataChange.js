define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Tasks) {
            bezl.vars.loading = false;
            bezl.vars.selectedAccount.Tasks = bezl.data.Tasks;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});