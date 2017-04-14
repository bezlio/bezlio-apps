define(function () {
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
    }
     return {
    onStartup: OnStartup
  }
});