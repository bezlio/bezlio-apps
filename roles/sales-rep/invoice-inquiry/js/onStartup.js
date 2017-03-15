define(function () {
    function OnStartup(bezl) {
        bezl.vars.startDate = "";
        bezl.vars.endDate = "";
        bezl.vars.sort = "";
        bezl.vars.sortCol = "";
        bezl.vars.sortInner = "";
        bezl.vars.sortColInner = "";
        bezl.vars.filter = "";
    }
     return {
    onStartup: OnStartup
  }
});