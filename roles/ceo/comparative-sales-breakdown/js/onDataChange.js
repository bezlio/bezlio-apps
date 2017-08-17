define(["./app.js"], function (app) {
    
    function OnDataChange (bezl) {
        if (bezl.data.SummaryData) {
            bezl.vars.loadingSummaryData = false;
            // This variable is used to prorate previous YTD numbers on the details window
            bezl.vars.currYearPercent = bezl.data.SummaryData[0]["Portion Of Year"];
        }

        if (bezl.data.ByProduct) {
            bezl.vars.loadingByProduct = false;
        }

        if (bezl.data.ByMonth) {
            bezl.vars.loadingByMonth = false;
        }
    }
     
    return {
        onDataChange: OnDataChange
    }
   });
   