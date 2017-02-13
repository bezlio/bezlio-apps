define(function () {
 
    function ClockIn (bezl) {

        var clockInEmployees = [];
        for (var i = 0; i < bezl.vars.team.length; i++) {
            if (bezl.vars.team[i].selected && !bezl.vars.team[i].clockedIn) {
                clockInEmployees.push(bezl.vars.team[i].key);
            }
        }

        bezl.dataService.add(
            'ClockIn'
            ,'brdb'
            ,'Epicor905'
            ,'Labor_ClockIn'
            , { 
                "Connection"    : bezl.vars.config.Connection,
                "Company"       : bezl.vars.config.Company,
                "EmployeeNum"   : clockInEmployees,
                "Shift"         : bezl.vars.config.Shift
            },0);

        bezl.vars.clockingIn = true;  
    }

    function ClockInResponse (bezl, responseData) {
        for (var i = 0; i < responseData.LaborHed.length; i++) {
            for (var x = 0; x < bezl.vars.team.length; x++) {
                if (bezl.vars.team[x].key == responseData.LaborHed[i].EmployeeNum) {
                    bezl.vars.team[x].LaborHed = responseData.LaborHed[i];
                    bezl.vars.team[x].clockedIn = 1;
                }
            }
        }
    }

    function ClockOut (bezl) {        
         for (var i = 0; i < bezl.vars.team.length; i++) {
            if (bezl.vars.team[i].selected && bezl.vars.team[i].clockedIn) {
                bezl.dataService.add(
                    'ClockOut_' + bezl.vars.team[i].key
                    ,'brdb'
                    ,'Epicor905'
                    ,'ExecuteBOMethod'
                    , { 
                        'Connection'    : bezl.vars.config.Connection
                        , 'Company'     : bezl.vars.config.Company
                        , 'BOName'      : 'EmpBasic'
                        , 'BOMethodName': 'ClockOut'
                        , 'Parameters'  : [
                            { 'Key': 'employeeID', 'Value': bezl.vars.team[i].key }
                        ] 
                    }
                    ,0);
                
                bezl.vars.clockingOutId = bezl.vars.team[i].key;
                bezl.vars.clockingOut = true;
            }
        };   
    }

    function EndActivities (bezl) {        

    }

    function StartJob (bezl, job) {  
        var laborHeds = [];
        for (var i = 0; i < bezl.vars.team.length; i++) {
            if (bezl.vars.team[i].selected && !bezl.vars.team[i].clockedIn) {
                laborHeds.push(((bezl.vars.team[i].LaborHed) ? bezl.vars.team[i].LaborHed.LaborHedSeq : bezl.vars.team[i].laborId));
            }
        }

        bezl.dataService.add(
            'StartJob'
            ,'brdb'
            ,'Epicor905'
            ,'Labor_StartActivity'
            , { 
                'Connection'    : bezl.vars.config.Connection
                ,'Company'      : bezl.vars.config.Company
                ,'LaborHedSeq'  : laborHeds
                ,'JobNum'       : job.data.JobNum
                ,'JobAsm'       : job.data.AssemblySeq
                ,'JobOp'        : job.data.OprSeq
        },0);
        
        bezl.vars.startingJob = true;
    }

    function StartJobResponse (bezl, responseData) {

    }

    function StartIndirect (bezl, indirect) {        

    }
 
    return {
        clockIn: ClockIn,
        clockInResponse: ClockInResponse,
        clockOut: ClockOut,
        endActivities: EndActivities,
        startJob: StartJob,
        startJobResponse: StartJobResponse,
        startIndirect: StartIndirect
    }
});