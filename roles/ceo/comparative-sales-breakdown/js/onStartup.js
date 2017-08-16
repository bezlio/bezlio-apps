define(["./app.js"], function (app) {
    
     function OnStartup (bezl) {
   
       // Load up the sales data from the data source
       app.getData(bezl, 'SummaryData');

       // Also start loading up the product level data
       app.getData(bezl, 'ByProduct');
     }
     
     return {
       onStartup: OnStartup
     }
   });