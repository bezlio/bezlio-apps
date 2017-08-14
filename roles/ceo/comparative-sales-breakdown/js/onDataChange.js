define(["./app.js"], function (app) {
    
    function OnDataChange (bezl) {
        if (bezl.data.SummaryData) {
            bezl.vars.loadingSummaryData = false;
        }

        if (bezl.data.ByProduct) {
            bezl.vars.loadingByProduct = false;
        }
    }
     
    return {
        onDataChange: OnDataChange
    }
   });
   