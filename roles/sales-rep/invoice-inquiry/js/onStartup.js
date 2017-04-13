define(function () {
    function OnStartup(bezl) {

      var endDate= new Date();
      var startDate= new Date().setDate(endDate.getDate()-30);

      console.log(endDate);
      console.log(startDate);

        bezl.vars.startDate = startDate.split('T')[0];
        bezl.vars.endDate = new Date(endDate).split('T')[0];
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