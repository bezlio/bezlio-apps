define(["./task.js"], function (task) {

  function OnStartup(bezl) {
    // Load the object for the selected customer from local storage into
    // a variable we can work with
    if (typeof (Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
      bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
    }

    // Also pull in the list of defined task types.  This is expecting a plugin instance
    // to be defined in BRDB named sales-rep-queries which points to a data source for call
    // types
    bezl.dataService.add('TaskTypes', 'brdb', 'sales-rep-queries', 'ExecuteQuery', { "QueryName": "GetTaskTypes" }, 0);

    $("#bezlpanel").on("selectAccount", function (event, param1) {
      bezl.vars.selectedAccount = param1;
    });

  }

  return {
    onStartup: OnStartup
  }
});