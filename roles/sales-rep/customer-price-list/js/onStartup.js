define(["./priceList.js"],function (priceList) {
    function OnStartup(bezl) {
        
        bezl.vars.loading = true;
        bezl.vars.CustID = "";
        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
        bezl.vars.filter = "";
        bezl.vars.custList = [];

        // Get All Accounts for dropdown
        priceList.runQuery(bezl, 'Accounts');

        // If there was a previously selected customer in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedAccount  = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
                bezl.vars.selectedAccount  = JSON.parse(localStorage.getItem("selectedAccount"));
                priceList.runQuery(bezl, 'Accounts');
                if (bezl.vars.config.autoLoad) {
                    priceList.runQuery(bezl, 'PriceList');
                }
            }

            $("#bezlpanel").on( "selectAccount", function(event, param1) {
                bezl.vars.selectedAccount = param1
                if (bezl.vars.config.autoLoadOnSelection) {
                    priceList.runQuery(bezl, 'PriceList');
                }
            });

    }
     return {
    onStartup: OnStartup
  }
});