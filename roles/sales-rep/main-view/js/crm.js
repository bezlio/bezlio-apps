define(function () {
 
    function AddNote (bezl) {

        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.CRMPlatform) {
            case "Epicor10":
                require(['https://rawgit.com/bezlio/bezlio-recipes/master/roles/sales-rep/main-view/js/integrations/epicor10.js'], function(functions) {
                    functions.addNote(bezl)
                });
                break;
            case "Excel":
                require(['https://rawgit.com/bezlio/bezlio-recipes/master/roles/sales-rep/main-view/js/integrations/excel.js'], function(functions) {
                    functions.addNote(bezl)
                });
                break;
            default:
                break;
        }

    }

    function UpdateTasks (bezl) {

        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.CRMPlatform) {
            case "Epicor10":
                require(['https://rawgit.com/bezlio/bezlio-recipes/master/roles/sales-rep/main-view/js/integrations/epicor10.js'], function(functions) {
                    functions.updateTasks(bezl)
                });
                break;
            case "Excel":
                require(['https://rawgit.com/bezlio/bezlio-recipes/master/roles/sales-rep/main-view/js/integrations/excel.js'], function(functions) {
                    functions.updateTasks(bezl)
                });
                break;
            default:
                break;
        }

    }

    function AddTask (bezl) {

        // Since this is going to be an API call as opposed to a straight
        // query, detect the CRM platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.CRMPlatform) {
            case "Epicor10":
                require(['https://rawgit.com/bezlio/bezlio-recipes/master/roles/sales-rep/main-view/js/integrations/epicor10.js'], function(functions) {
                    functions.addTask(bezl)
                });
                break;
            case "Excel":
                require(['https://rawgit.com/bezlio/bezlio-recipes/master/roles/sales-rep/main-view/js/integrations/excel.js'], function(functions) {
                    functions.addTask(bezl)
                });
                break;
            default:
                break;
        }

    }
  
    return {
        addNote: AddNote,
        updateTasks: UpdateTasks,
        addTask: AddTask
    }
});