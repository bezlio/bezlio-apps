define(["./rma.js"], function (rma) {
    function OnStartup(bezl) {

        bezl.vars.startDate = "";
        bezl.vars.endDate = "";
        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
        bezl.vars.filter = "";

        // If there was a previously selected customer in localStorage, grab a reference
            bezl.vars.selectedAccount  = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
                bezl.vars.selectedAccount  = JSON.parse(localStorage.getItem("selectedAccount"));
            }

             rma.runQuery(bezl, 'RMAInquiry');
    }
     return {
    onStartup: OnStartup
  }
});