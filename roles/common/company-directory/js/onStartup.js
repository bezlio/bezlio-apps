define(["./directory.js"], function (directory) {
 
  function OnStartup (bezl) {
    bezl.vars['config'].refreshing = true;
    
    // Load up the company directory from the data source
    bezl.dataService.add('directory',
                         'brdb',
                         bezl.vars.config.directoryPlugin,
                         bezl.vars.config.directoryMethod, 
                         bezl.vars.config.directoryArgs, 0);

  }
  
  return {
    onStartup: OnStartup
  }
});