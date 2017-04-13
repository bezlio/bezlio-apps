define(function () {
    function OnStartup(bezl) {

      var endDate= new Date();
      var startDate= new Date().setDate(endDate.getDate()-30);

        bezl.vars.startDate = startDate.toISOString().split('T')[0];
        bezl.vars.endDate = new Date(endDate).toISOString().split('T')[0];
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