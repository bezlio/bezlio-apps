define(["./app.js"], function (app) {
 
  function OnStartup (bezl) {

    // Load up the inventory data
    bezl.dataService.add('inventory',
                         'brdb',
                         bezl.vars.config.summaryDataPlugin,
                         bezl.vars.config.summaryDataMethod, 
                         bezl.vars.config.summaryDataArgs, 0);
  }
  
  return {
    onStartup: OnStartup
  }
});