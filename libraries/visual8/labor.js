define(function () {
 
    /**
     * Clocks in one or many employees into VISUAL. This function expect the custom table BEZLIO_LABOR_HEAD
     * which is used to keep track of the overall attendance status of employees.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} employee - Employee ID to clock in
     */
    function ClockIn (bezl
                    , employee) {

        bezl.dataService.add('ClockInStatus_' + employee,'brdb', bezl.vars.config.pluginInstance,'ExecuteNonQuery', { 
            "QueryName": "InsertClockIn",
            "Parameters": [
                { "Key": "EmployeeID", "Value": employee }
            ] },0);
            
        bezl.vars.clockingIn = false;
    }
 
    return {
        clockIn: ClockIn
    }
});