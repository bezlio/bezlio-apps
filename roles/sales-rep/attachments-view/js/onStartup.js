define(["./attachment.js"], function (attachment) {
 
  function OnStartup (bezl) {        
      // Load the object for the selected customer from local storage into
      // a variable we can work with
      if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
          bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
      }

      $(".panel").on("selectAccount", function(event, param1) {
        bezl.vars.selectedAccount = param1;
      });

  }
  
  return {
    onStartup: OnStartup
  }
});