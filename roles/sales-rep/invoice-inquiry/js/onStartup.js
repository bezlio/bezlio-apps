define(function () {
    function OnStartup(bezl) {
        bezl.vars.startDate = "00/00/2000";
        bezl.vars.endDate = "00/00/2000";
        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
        bezl.vars.sortInner = "";
    }
     return {
    onStartup: OnStartup
  }
});