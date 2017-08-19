define(["./app.js"], function (app) {
    
    function OnDataChange (bezl) {
        if (bezl.data.SummaryData) {
            bezl.vars.loadingSummaryData = false;

            // Use D3 to group the data by location and store the result in a new
            // variable named summaryData
            bezl.vars.summaryData = d3.nest().key(function(d) { return d.Location; }).entries(bezl.data.SummaryData);

            // Now dispose of bezl.data.SummaryData since we no longer need it
            bezl.data.SummaryData = null;
            bezl.dataService.remove('SummaryData');
        }
    }
    
    return {
        onDataChange: OnDataChange
    }
   });
   