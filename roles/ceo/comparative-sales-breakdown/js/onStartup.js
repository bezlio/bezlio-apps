define(["./app.js"], function (app) {
    
     function OnStartup (bezl) {
   
       // Load up the sales data from the data source
       app.getData(bezl, 'SummaryData');
     }
     
     return {
       onStartup: OnStartup
     }
   });