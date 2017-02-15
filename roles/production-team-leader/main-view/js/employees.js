define(function () {
 
    function Select (bezl, employee) {        
        // Also update the actual team array
        var teamUpdated = false;
        for (var i = 0; i < bezl.vars.team.length; i++) {
            if (bezl.vars.team[i].key == employee.key) {
                teamUpdated = true;
                var $row = $("#jsGridTeam").jsGrid("rowByItem", bezl.vars.team[i]);

                if (bezl.vars.team[i].selected) {
                    bezl.vars.team[i].selected = false;
                    bezl.vars.employeesSelected -= 1;
                    $row.children('.jsgrid-cell').css('background-color','');
                } else {
                    bezl.vars.team[i].selected = true;
                    bezl.vars.employeesSelected += 1;
                    $row.children('.jsgrid-cell').css('background-color','#F7B64B');
                }
            }
        };

        // If the team was not updated, that means an employee was selected that this
        // not currently a part of the leaders team.  Prompt for confirmation they wish
        // to add this team member (which will pop them into the team array and run this
        // method again)
        if (!teamUpdated) {
            bezl.vars.addToTeamPrompt = true;
            bezl.vars.addToTeam = employee;
        } else {
            $('html, body').animate({
                    scrollTop: $("#actionButtons").offset().top
                }, 2000);
        }
    }

    function SelectAll (bezl) {        
        bezl.vars.employeesSelected = bezl.vars.team.length;
        for (var i = 0; i < bezl.vars.team.length; i++) {
            var $row = $("#jsGridTeam").jsGrid("rowByItem", bezl.vars.team[i]);
            bezl.vars.team[i].selected = true;
            $row.children('.jsgrid-cell').css('background-color','#F7B64B');
        };
    }

    function DeselectAll (bezl) {        
        bezl.vars.employeesSelected = 0;
        for (var i = 0; i < bezl.vars.team.length; i++) {
            var $row = $("#jsGridTeam").jsGrid("rowByItem", bezl.vars.team[i]);
            bezl.vars.team[i].selected = false;
            $row.children('.jsgrid-cell').css('background-color','');
        };
    }

    function AddToTeam (bezl, employee) {   
        // Add the selected employee to the team array    
        bezl.vars.team.push(employee);

        // Reload the grid to include this new team member
        $("#jsGridTeam").jsGrid("loadData");
        HighlightSelected(bezl);

        // Call the standard logic to select the newly added employee
        Select(bezl, employee);

        // Clear out variables used in support of the pop-up
        bezl.vars.addToTeamPrompt = false;
        bezl.vars.addToTeam = {};
        bezl.vars.selectedEmployee.Name = "";
    }

    function HighlightSelected (bezl) {
        // Re-highlight any employees that were previously selected on the team
        for (var i = 0; i < bezl.vars.team.length; i++) {
            var $row = $("#jsGridTeam").jsGrid("rowByItem", bezl.vars.team[i]);

            if (bezl.vars.team[i].selected) {
                $row.children('.jsgrid-cell').css('background-color','#F7B64B');
            } 
        };
    }

    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "Team":
                // Pull in the team for the logged in user
                bezl.dataService.add('Team','brdb','production-team-leader-queries','ExecuteQuery', { 
                    "QueryName": "GetTeam",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                bezl.vars.refreshingTeam = true;
                break;
            case "AllEmployees":
                // Pull in all of the employees for the search box
                bezl.dataService.add('AllEmployees','brdb','production-team-leader-queries','ExecuteQuery', { 
                    "QueryName": "GetAllEmployees",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                    bezl.vars.loadingEmployees = true;
                break;
            case "OpenJobs":
                // Pull in all of the employees for the search box
                bezl.dataService.add('OpenJobs','brdb','production-team-leader-queries','ExecuteQuery', { 
                    "QueryName": "GetTeamJobs",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                    bezl.vars.loadingJobs = true;
                break;
            default:
                bezl.notificationService.showCriticalError('Unknown query ' + queryName);
                break;
        }
    }

    function ClockIn (bezl) {        
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.Platform) {
            case "Epicor905":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/epicor905/labor.js'], function(labor) {

                    var clockInEmployees = [];
                    for (var i = 0; i < bezl.vars.team.length; i++) {
                        if (bezl.vars.team[i].selected && !bezl.vars.team[i].clockedIn) {
                            clockInEmployees.push(bezl.vars.team[i].key);
                        }
                    }

                    labor.clockIn(bezl
                                , bezl.vars.config.Connection
                                , bezl.vars.config.Company
                                , clockInEmployees
                                , bezl.vars.config.Shift);

                    bezl.vars.clockingIn = true;  
                });
                break;
            case "Excel":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/excel/labor.js'], function(functions) {
                    functions.clockIn(bezl)
                });
                break;
            default:
                break;
        }
    }

    function ClockOut (bezl) {        
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.Platform) {
            case "Epicor905":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/epicor905/labor.js'], function(labor) {
                    
                    var clockOutEmployees = [];
                    for (var i = 0; i < bezl.vars.team.length; i++) {
                        if (bezl.vars.team[i].selected && bezl.vars.team[i].clockedIn) {
                            clockOutEmployees.push(bezl.vars.team[i].key);
                        }
                    }

                    labor.clockOut(bezl
                                , bezl.vars.config.Connection
                                , bezl.vars.config.Company
                                , clockOutEmployees);

                    bezl.vars.clockingOut = true;  
                });
                break;
            case "Excel":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/excel/labor.js'], function(functions) {
                    functions.clockOut(bezl)
                });
                break;
            default:
                break;
        }
    }

    function EndActivities (bezl) {        
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.Platform) {
            case "Epicor905":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/epicor905/labor.js'], function(labor) {
                    labor.endActivities(bezl)
                });
                break;
            case "Excel":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/excel/labor.js'], function(functions) {
                    functions.endActivities(bezl)
                });
                break;
            default:
                break;
        }
    }

    function StartJob (bezl, job) {        
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.Platform) {
            case "Epicor905":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/epicor905/labor.js'], function(labor) {
                    var laborHeds = [];
                    for (var i = 0; i < bezl.vars.team.length; i++) {
                        if (bezl.vars.team[i].selected && bezl.vars.team[i].clockedIn) {
                            laborHeds.push(((bezl.vars.team[i].LaborHed) ? bezl.vars.team[i].LaborHed.LaborHedSeq : bezl.vars.team[i].laborId));
                        }
                    }

                    labor.startJob(bezl
                                , bezl.vars.config.Connection
                                , bezl.vars.config.Company
                                , laborHeds
                                , job.data.JobNum
                                , job.data.AssemblySeq
                                , job.data.OprSeq);

                    bezl.vars.startingJob = true;
                });
                break;
            case "Excel":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/excel/labor.js'], function(functions) {
                    functions.startJob(bezl, job)
                });
                break;
            default:
                break;
        }

        bezl.vars.showJobDialog = false;
    }

    function StartIndirect (bezl, indirect) {        
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        switch (bezl.vars.config.Platform) {
            case "Epicor905":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/epicor905/labor.js'], function(functions) {
                    functions.startIndirect(bezl, indirect)
                });
                break;
            case "Excel":
                require([bezl.vars.config.ScriptsBasePath + '/libraries/excel/labor.js'], function(functions) {
                    functions.startIndirect(bezl, indirect)
                });
                break;
            default:
                break;
        }
    }
 
    return {
        select: Select,
        selectAll: SelectAll,
        deselectAll: DeselectAll,
        addToTeam: AddToTeam,
        highlightSelected: HighlightSelected,
        runQuery: RunQuery,
        clockIn: ClockIn,
        clockOut: ClockOut,
        endActivities: EndActivities,
        startJob: StartJob,
        startIndirect: StartIndirect
    }
});