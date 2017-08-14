define(["./app.js"], function (app) {
    
    function OnDataChange (bezl) {
        if (bezl.data.SummaryData) {
            bezl.vars.loadingSummaryData = false;
        }
    }
     
    return {
        onDataChange: OnDataChange
    }
   });
   