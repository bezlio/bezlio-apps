define(["./edi855O.js"], function (edi855O) {
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
        bezl.vars.showApproval = false;
        bezl.vars.showDelete = false;

        //Reset bezl data.
        bezl.vars.main = "";
        bezl.vars.viewdetails = "";
        bezl.vars.viewfile = "";
        bezl.vars.user = "";
        bezl.vars.approve = "";

        //Get User Settings.
        edi855O.runQuery(bezl, "GetUserSettings");
    }

     return {
    onStartup: OnStartup
  }
});
