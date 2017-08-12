define(["./directory.js"], function (directory) {
 
    function OnDataChange (bezl) {
        if (bezl.data.directory != null && bezl.data.directory.length > 0) {
            directory.regenerateOutput();
            bezl.vars.config.refreshing = false;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
