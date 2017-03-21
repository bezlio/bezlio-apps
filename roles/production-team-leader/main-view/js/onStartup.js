define(["./employees.js"], function (employees) {
 
    function OnStartup (bezl) {
        // Call setConfig which defines the handful of settings that you may wish to tweak
        bezl.functions['setConfig']();

        // Default the number of selected employees on the team grid to 0
        bezl.vars.employeesSelected = 0;

        // Default the openJobs object so we do not get any errors when the jsGrid loadData
        // is run (which includes a filter)
        bezl.vars.openJobs = [];
        
        // Initiate the queries to run up front
        employees.runQuery(bezl, 'Team');
        employees.runQuery(bezl, 'AllEmployees');
        employees.runQuery(bezl, 'OpenJobs');

        // Configure the team members jsGrid
        $("#jsGridTeam").jsGrid({
        width: "100%",
        height: "100%",
        heading: true,
        sorting: true,
        autoload: true, 	
        inserting: false,
        controller: {
            loadData: function() {
            return bezl.vars.team;
            }
        },
        fields: [
            { name: "display", title: "Name", type: "text", visible: true, width: 50, editing: false },
            { name: "clockedIn", title: "Clocked In", align: "center", width: 25,
            	itemTemplate: function(value, item) {
              	return $("<input>").attr("type", "checkbox")
                		.attr("checked", value || item.Checked)
                    .on("change", function() {
                    	item.Checked = $(this).is(":checked");
                    });
              }
            },
            { name: "currentActivity", title: "Current Activity", type: "text", visible: true, width: 50, editing: false }
        ],
        rowClick: function(args) {
            employees.select(bezl, args.item);
        }
        });
    
        // Configure the team members jsGrid
        $("#jsGridJobs").jsGrid({
        width: "600",
        height: "400",
        heading: true,
        filtering: true,
        sorting: true,
        autoload: true, 	
        inserting: false,
        controller: {
            loadData: function(filter) {
                return $.grep(bezl.vars.openJobs, function (item) {
                    return (item.jobId.indexOf(filter.jobId) >= 0
                            && item.jobDesc.indexOf(filter.jobDesc) >= 0);
                });
            }
        },
        fields: [
            { name: "jobId", title: "Job", type: "text", visible: true, width: 25, editing: false },
            { name: "jobDesc", title: "Description", type: "text", visible: true, width: 50, editing: false }
        ],
        rowClick: function(args) {
            bezl.vars.selectedJob = args.item;

            // Highlight the selected row in jsGrid
            if ( bezl.vars.selectedRow ) { bezl.vars.selectedRow.children('.jsgrid-cell').css('background-color', ''); }
            var $row = this.rowByItem(args.item);
            $row.children('.jsgrid-cell').css('background-color','#F7B64B');
            bezl.vars.selectedRow = $row;
        }
        });
    
    }
  
 
  return {
    onStartup: OnStartup
  }
});