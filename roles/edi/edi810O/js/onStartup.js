define(["./edi810O.js"], function (edi810O) {
    function OnStartup(bezl) {
        //Reset Bezl variables.
        bezl.vars.filterEdiStatus = "H";
        bezl.vars.filter = "";
        bezl.vars.search = "";
        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
        bezl.vars.DASH_HEADER_ID = 0;
        bezl.vars.showViewDetails = false;
        bezl.vars.showViewFile = false;
        bezl.vars.loading = true;
        bezl.vars.showApproval = false;
        bezl.vars.showDelete = false;
        bezl.vars.approvalData = [];
        bezl.vars.approvalCompleted = false;
        
        //Reset bezl data.
        bezl.vars.main = "";
        bezl.vars.viewdetails = "";
        bezl.vars.viewfile = "";
        bezl.vars.user = "";
        bezl.vars.approve = "";

        //Get User Settings.
        edi810O.runQuery(bezl, "GetUserSettings");
    }

     return {
    onStartup: OnStartup
  }
});
