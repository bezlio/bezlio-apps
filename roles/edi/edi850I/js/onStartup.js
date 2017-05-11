define(["./edi850I.js"], function (edi850I) {
    function OnStartup(bezl) {
        //Reset Bezl variables.
        bezl.vars.filterEdiStatus = "H";
        bezl.vars.filter = "";
        bezl.vars.search = "";
        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
        bezl.vars.EDI_SL_DASH_HEADER_ID = 0;
        bezl.vars.showViewDetails = false;
        bezl.vars.showViewFile = false;
        bezl.vars.loading = true;

        //Reset bezl data.
        bezl.vars.datasub = "";
        bezl.vars.viewdetails = "";
        bezl.vars.viewfile = "";
        bezl.vars.user = "";

        //Get User Settings.
        edi850I.runQuery(bezl, "GetUserSettings");
    }

     return {
    onStartup: OnStartup
  }
});
