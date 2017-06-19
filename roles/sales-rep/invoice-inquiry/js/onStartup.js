define(["./invoice.js"], function (invoice) {
    function OnStartup(bezl) {
      // dates have some quirks where you have to set it, then modify it. 
      var endDate= new Date();
      var startDate= new Date();
      startDate.setDate(endDate.getDate()-30);

       bezl.vars.startDate = startDate.toISOString().split('T')[0];
       bezl.vars.endDate = endDate.toISOString().split('T')[0];

        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
        bezl.vars.sortInner = "";
        bezl.vars.sortColInner = "";
        bezl.vars.filter = "";

        // If there was a previously selected customer in localStorage, grab a reference
            bezl.vars.selectedAccount  = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
                bezl.vars.selectedAccount  = JSON.parse(localStorage.getItem("selectedAccount"));
            }

        // Set up event handler for selection of customer on account view
        $("#bezlpanel").on( "selectAccount", function(event, param1) {
                bezl.vars.selectedAccount = param1
                invoice.runQuery(bezl, 'Invoices');
            });

    }
     return {
    onStartup: OnStartup
  }
});