define(function () {
 
    /**
     * Clocks in one or many employees into MES.  Function simply creates BRDB call so monitor
     * for return in onDataChange.  The return presented there will return the LaborHed record
     * for each of the employees that were successfully clocked in.
     * @param {string} connection - The nammed connection as specified in Epicor905.dll.config
     * @param {string} company - The company ID within Epicor
     * @param {Object[]} employees - An array of employee IDs
     * @param {Number} shift - The shift number to clock all employees onto
     */
    function ClockIn (bezl
                    , connection
                    , company
                    , employees
                    , shift) {
        bezl.dataService.add(
            'ClockIn'
            ,'brdb'
            ,'Epicor905'
            ,'Labor_ClockIn'
            , { 
                "Connection"    : connection,
                "Company"       : company,
                "EmployeeNum"   : employees,
                "Shift"         : shift
            },0);
    }

    /**
     * This method can be used for the ClockIn response within onDataChange.  It will take
     * a provided employee array object and append to it the successful LaborHed records.
     * @param {Object[]} employees - An array of employee IDs
     * @param {Object[]} responseData - The response object (bezl.data.ClockIn)
     * @returns {Object[]} employees - The employees object returned with the LaborHed records
     */
    function ClockInResponse (bezl
                            , employees
                            , responseData) {

        for (var i = 0; i < responseData.LaborHed.length; i++) {
            for (var x = 0; x < employees.length; x++) {
                if (employees[x] == responseData.LaborHed[i].EmployeeNum) {
                    employees[x].LaborHed = responseData.LaborHed[i];
                    employees[x].clockedIn = 1;
                }
            }
        }

        return employees;
    }

    /**
     * Clocks out one or many employees from MES.  Function simply creates BRDB call so monitor
     * for return in onDataChange.  The return presented there will be an array of EmployeeNum,
     * an Error column indicating whether there was an error, and ErrorText containing the errors
     * presented by the BO if an error did occur
     * @param {string} connection - The nammed connection as specified in Epicor905.dll.config
     * @param {string} company - The company ID within Epicor
     * @param {Object[]} employees - An array of employee IDs
     * @param {Number} shift - The shift number to clock all employees onto
     */
    function ClockOut (bezl
                    , connection
                    , company
                    , employees) { 

        bezl.dataService.add(
            'ClockOut'
            ,'brdb'
            ,'Epicor905'
            ,'Labor_ClockOut'
            , { 
                "Connection"    : connection,
                "Company"       : company,
                "EmployeeNum"   : employees
            },0); 
    }

    /**
     * This method can be used for the ClockIn response within onDataChange.  It will take
     * a provided employee array object and append to it the successful LaborHed records.
     * @param {Object[]} employees - An array of employee IDs
     * @param {Object[]} responseData - The response object (bezl.data.ClockOut)
     * @returns {Object[]} employees - The employees object returned with the LaborHed records
     */
    function ClockOutResponse (bezl
                            , employees
                            , responseData) {

        for (var i = 0; i < responseData.length; i++) {
            for (var x = 0; x < employees.length; x++) {
                if (employees[x] == responseData[i].EmployeeNum && !responseData[i].Error) {
                    employees[x].LaborHed = [];
                    employees[x].clockedIn = 0;
                }
            }
        }

        return employees;
    }

    function EndActivities (bezl) {        

    }

    /**
     * Start the provided job on the specified list of LaborHed numbers.  Function simply creates BRDB 
     * call so monitor for return in onDataChange.  The return presented there will be a dataset
     * of Labor records for the provided LaborHed numbers
     * @param {string} connection - The nammed connection as specified in Epicor905.dll.config
     * @param {string} company - The company ID within Epicor
     * @param {Object[]} laborHeds - An array of laborhed numbers
     * @param {Number} jobNum - The job number to clock onto
     * @param {Number} assemblySeq - The assembly sequence to clock onto
     * @param {Number} oprSeq - The operation sequence to clock onto
     */
    function StartJob (bezl
                    , connection
                    , company
                    , laborHeds
                    , jobNum
                    , assemblySeq
                    , oprSeq) {
        bezl.dataService.add(
            'StartJob'
            ,'brdb'
            ,'Epicor905'
            ,'Labor_StartActivity'
            , { 
                'Connection'    : connection
                ,'Company'      : company
                ,'LaborHedSeq'  : laborHeds
                ,'JobNum'       : jobNum
                ,'JobAsm'       : assemblySeq
                ,'JobOp'        : oprSeq
        },0);
    }

    function StartIndirect (bezl, indirect) {        

    }
 
    return {
        clockIn: ClockIn,
        clockOut: ClockOut,
        endActivities: EndActivities,
        startJob: StartJob,
        startIndirect: StartIndirect
    }
});