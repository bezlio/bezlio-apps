define(["./employees.js"], function (employees) {
 
    function OnDataChange (bezl) {
        // Populate the 'team' array if we got Team back
        if (bezl.data.Team) {
            for (var x = 0; x < bezl.data.Team.length; x++) {
                var teamMemberFound = false;
                for (var i = 0; i < bezl.vars.team.length; i++) {
                    if (bezl.vars.team[i].key == bezl.data.Team[x].EmpID) {
                        var teamMemberFound = true;
                        bezl.vars.team[i].clockedIn = bezl.data.Team[i].ClockedIn;
                        bezl.vars.team[i].laborId = bezl.data.Team[i].LaborID;
                        bezl.vars.team[i].currentActivity = bezl.data.Team[i].CurrentActivity;
                    }
                }

                if (!teamMemberFound) {
                    bezl.vars.team.push({ selected: false,
                            key: bezl.data.Team[i].EmpID,
                            display: bezl.data.Team[i].Name,
                            clockedIn: bezl.data.Team[i].ClockedIn,
                            laborId: bezl.data.Team[i].LaborID,
                            currentActivity: bezl.data.Team[i].CurrentActivity
                            });
                }
            }
                
            // Tell the jsGrid to load up
            $("#jsGridTeam").jsGrid("loadData");
            employees.highlightSelected(bezl);
            
            bezl.vars.refreshingTeam = false;
            
            // Clean up CustList data subscription as we no longer need it
            bezl.dataService.remove('Team');
            bezl.data.Team = null;
        }

        // Populate the 'allEmployees' array if we got AllEmployees back
        if (bezl.data.AllEmployees) {
            bezl.vars.allEmployees = [];
            for (var i = 0; i < bezl.data.AllEmployees.length; i++) {
                bezl.vars.allEmployees.push({ selected: false,
                                            key: bezl.data.AllEmployees[i].EmpID,
                                            display: bezl.data.AllEmployees[i].Name,
                                            clockedIn: bezl.data.AllEmployees[i].ClockedIn,
                                            laborId: bezl.data.AllEmployees[i].LaborID
                                            });
            }
        
            // Configure the typeahead controls for the team search.  For full documentation of
            // available settings here see http://www.runningcoder.org/jquerytypeahead/documentation/
            $('.js-typeahead-team').typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function() { return bezl.vars.allEmployees; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        employees.select(bezl, item);
                    }
                }
            });
        
            $('.js-typeahead-team2').typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function() { return bezl.vars.allEmployees; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        employees.select(bezl, item);
                    }
                }
            });
        
            bezl.vars.loadingEmployees = false;
            
            // Clean up AllEmployees data subscription as we no longer need it
            bezl.dataService.remove('AllEmployees');
            bezl.data.AllEmployees = null;
        }

        // Populate the 'jobs' array if we got Team back
        if (bezl.data.OpenJobs) {
            bezl.vars.openJobs = [];
            for (var i = 0; i < bezl.data.OpenJobs.length; i++) {
                bezl.vars.openJobs.push({ jobId: bezl.data.OpenJobs[i].JobID,
                        jobDesc: bezl.data.OpenJobs[i].JobDesc,
                        data: bezl.data.OpenJobs[i]
                        });
            }
                
            bezl.vars.loadingJobs = false;

            // Tell the jsGrid to load up
            $("#jsGridJobs").jsGrid("loadData");
                        
            // Clean up CustList data subscription as we no longer need it
            bezl.dataService.remove('OpenJobs');
            bezl.data.OpenJobs = null;
        }
   
        if (bezl.data.ClockIn) {
            bezl.vars.clockingIn = false;

            switch (bezl.vars.config.Platform) {
                case "Epicor905":
                    for (var i = 0; i < bezl.data.ClockIn.LaborHed.length; i++) {
                        for (var x = 0; x < bezl.vars.team.length; x++) {
                            if (bezl.vars.team[x].key == bezl.data.ClockIn.LaborHed[i].EmployeeNum) {
                                bezl.vars.team[x].LaborHed = bezl.data.ClockIn.LaborHed[i];
                                bezl.vars.team[x].clockedIn = 1;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }

            bezl.dataService.remove('ClockIn');
            bezl.data.ClockIn = null;
            $("#jsGridTeam").jsGrid("loadData");
            employees.highlightSelected(bezl);
        }

        if (bezl.data.ClockOut) {
            bezl.vars.clockingOut = false;

            switch (bezl.vars.config.Platform) {
                case "Epicor905":
                    for (var i = 0; i < bezl.data.ClockOut.length; i++) {
                        for (var x = 0; x < bezl.vars.team.length; x++) {
                            if (bezl.vars.team[x].key == bezl.data.ClockOut[i].EmployeeNum && !bezl.data.ClockOut[i].Error) {
                                bezl.vars.team[x].LaborHed = [];
                                bezl.vars.team[x].clockedIn = 0;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }

            bezl.dataService.remove('ClockOut');
            bezl.data.ClockOut = null;
            $("#jsGridTeam").jsGrid("loadData");
            employees.highlightSelected(bezl);
        }

        if (bezl.data.StartJob) {
            bezl.vars.startingJob = false;

            switch (bezl.vars.config.Platform) {
                case "Epicor905":
                    for (var i = 0; i < bezl.data.StartJob.LaborHed.length; i++) {
                        for (var x = 0; x < bezl.vars.team.length; x++) {
                            if (bezl.vars.team[x].key == bezl.data.StartJob.LaborHed[i].EmployeeNum) {
                                bezl.vars.team[x].currentActivity = bezl.vars.selectedJob.jobId;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }

            bezl.dataService.remove('StartJob');
            bezl.data.StartJob = null;
            $("#jsGridTeam").jsGrid("loadData");
            employees.highlightSelected(bezl);
        }

    }
  
    return {
        onDataChange: OnDataChange
    }
});