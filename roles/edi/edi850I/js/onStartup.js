define(["./edi850I.js"], function (edi850I) {
    function OnStartup(bezl) {
        //Reset Bezl variables.
        bezl.vars.filterEdiStatus = "H";
        bezl.vars.filter = "";
        bezl.vars.search = "";

        edi850I.runQuery(bezl, "GetDashHeaderData");

        edi850I.filterEdiStatus(bezl);
    }



     return {
    onStartup: OnStartup
  }
});
