define(["./app.js"], function (app) {
    
     function OnStartup (bezl) {
   
       // Load up the sales data from the data source
       bezl.dataService.add('SalesData',
                            'brdb',
                            bezl.vars.config.salesDataPlugin,
                            bezl.vars.config.salesDataMethod, 
                            bezl.vars.config.salesDataArgs, 0);   
     }
     
     return {
       onStartup: OnStartup
     }
   });