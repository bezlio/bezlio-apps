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

        //Reset bezl data.
        bezl.vars.datasub = "";
        bezl.vars.viewdetails = "";
        bezl.vars.viewfile = "";
        bezl.vars.user = "";

        //Get User Settings.
        edi850I.runQuery(bezl, "GetUserSettings");

        //Get Header Data.
        edi850I.runQuery(bezl, "GetDashHeaderData");

        edi850I.filterEdiStatus(bezl);
    }

     return {
    onStartup: OnStartup
  }
});
