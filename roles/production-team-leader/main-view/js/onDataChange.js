define(["./employees.js"], function (employees) {
 
    function OnDataChange (bezl) {
        // Loop through the employees list and add them to bezl.vars.employees no matter what
        // and to the team if the SupervisorID matches the currenly logged in user
        if (bezl.data.Employees) {
            bezl.vars.employees = [];
            for (var i = 0; i < bezl.data.Employees.length; i++) {
                bezl.vars.employees.push({ selected: false,
                                            key: bezl.data.Employees[i].EmpID,
                                            display: bezl.data.Employees[i].Name,
                                            clockedIn: bezl.data.Employees[i].ClockedIn,
                                            laborId: bezl.data.Employees[i].LaborID,
                                            currentActivity: bezl.data.Employees[i].CurrentActivity,
                                            pendingQty: bezl.data.Employees[i].PendingQty
                                        });
                                        
                if (bezl.data.Employees[i].SupervisorID == bezl.env.currentUser) {
                    var teamMemberFound = false;

                    for (var i = 0; i < bezl.vars.team.length; i++) {
                        if (bezl.vars.team[i].key == bezl.data.Employees[x].EmpID) {
                            var teamMemberFound = true;
                            bezl.vars.team[i].clockedIn = bezl.data.Employees[i].ClockedIn;
                            bezl.vars.team[i].laborId = bezl.data.Employees[i].LaborID;
                            bezl.vars.team[i].currentActivity = bezl.data.Employees[i].CurrentActivity;
                            bezl.vars.team[i].pendingQty = bezl.data.Employees[i].PendingQty;
                        }
                    }

                    if (!teamMemberFound) {
                        bezl.vars.team.push({ selected: false,
                                key: bezl.data.Employees[i].EmpID,
                                display: bezl.data.Employees[i].Name,
                                clockedIn: bezl.data.Employees[i].ClockedIn,
                                laborId: bezl.data.Employees[i].LaborID,
                                currentActivity: bezl.data.Employees[i].CurrentActivity,
                                pendingQty: bezl.data.Employees[i].PendingQty
                                });
                    }
                }
            }
        
            // Configure the typeahead controls for the team search.  For full documentation of
            // available settings here see http://www.runningcoder.org/jquerytypeahead/documentation/
            $('.js-typeahead-team').typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function() { return bezl.vars.employees; }
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
                    data: function() { return bezl.vars.employees; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        employees.select(bezl, item);
                    }
                }
            });

            // Tell the jsGrid to load up
            $("#jsGridTeam").jsGrid("loadData");
            employees.highlightSelected(bezl);
        
            bezl.vars.loadingEmployees = false;
            bezl.vars.refreshingTeam = false;
            
            // Clean up Employees data subscription as we no longer need it
            bezl.dataService.remove('Employees');
            bezl.data.Employees = null;
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

            if (bezl.vars.config.Platform == "Epicor905" || bezl.vars.config.Platform == "Epicor10") {
                for (var i = 0; i < bezl.data.ClockIn.LaborHed.length; i++) {
                    for (var x = 0; x < bezl.vars.team.length; x++) {
                        if (bezl.vars.team[x].key == bezl.data.ClockIn.LaborHed[i].EmployeeNum) {
                            bezl.vars.team[x].LaborHed = bezl.data.ClockIn.LaborHed[i];
                            bezl.vars.team[x].clockedIn = 1;
                        }
                    }
                }
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
                                bezl.vars.team[x].currentActivity = '';
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

            if (bezl.vars.config.Platform == "Epicor905" || bezl.vars.config.Platform == "Epicor10") {
                for (var i = 0; i < bezl.data.StartJob.LaborHed.length; i++) {
                    for (var x = 0; x < bezl.vars.team.length; x++) {
                        if (bezl.vars.team[x].key == bezl.data.StartJob.LaborHed[i].EmployeeNum) {
                            bezl.vars.team[x].currentActivity = bezl.vars.selectedJob.jobId;
                            bezl.vars.team[x].pendingQty = bezl.vars.selectedJob.pendingQty;
                        }
                    }
                }
            }

            bezl.dataService.remove('StartJob');
            bezl.data.StartJob = null;
            $("#jsGridTeam").jsGrid("loadData");
            employees.highlightSelected(bezl);
        }

        if (bezl.data.EndActivities) {
            bezl.vars.endingActivities = false;

            if (bezl.vars.config.Platform == "Epicor905" || bezl.vars.config.Platform == "Epicor10") {
                for (var i = 0; i < bezl.data.EndActivities.LaborHed.length; i++) {
                    for (var x = 0; x < bezl.vars.team.length; x++) {
                        if (bezl.vars.team[x].key == bezl.data.EndActivities.LaborHed[i].EmployeeNum) {
                            bezl.vars.team[x].currentActivity = '';
                        }
                    }
                }
            }

            bezl.dataService.remove('EndActivities');
            bezl.data.EndActivities = null;
            $("#jsGridTeam").jsGrid("loadData");
            employees.highlightSelected(bezl);
        }

    }
  
    return {
        onDataChange: OnDataChange
    }
});