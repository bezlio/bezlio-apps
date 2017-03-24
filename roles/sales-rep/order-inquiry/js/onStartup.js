define(function () {
    function OnStartup(bezl) {
        bezl.vars.startDate = "";
        bezl.vars.endDate = "";
        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
        bezl.vars.filter = "All";

        // Set up filter Listener
        $("#Filter").change(function () {
            bezl.functions.filter(bezl);
        });
    }
     return {
    onStartup: OnStartup
  }
});