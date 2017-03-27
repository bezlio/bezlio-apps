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
        // hide filter, ngIf will prevent jquery from setting up the listener
        $("#Filter").hide();
    }
     return {
    onStartup: OnStartup
  }
});