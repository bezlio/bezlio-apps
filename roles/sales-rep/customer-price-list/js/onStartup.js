define(function () {
    function OnStartup(bezl) {
        bezl.vars.CustID = "";
        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
    }
     return {
    onStartup: OnStartup
  }
});