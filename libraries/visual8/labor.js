define(function () {
 
    /**
     * Clocks in an employee into VISUAL. This function expect the custom table BEZLIO_LABOR_HEAD
     * which is used to keep track of the overall attendance status of employees.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} employee - Employee ID to clock in
     */
    function ClockIn (bezl
                    , employee) {

        bezl.dataService.add('ClockIn_' + employee,'brdb', bezl.vars.config.pluginInstance,'ExecuteNonQuery', { 
            "QueryName": "InsertLaborHead",
            "Parameters": [
                { "Key": "EmployeeID", "Value": employee }
            ] },0);
    }

    /**
     * Clocks out an employee into VISUAL. This function expect the custom table BEZLIO_LABOR_HEAD
     * which is used to keep track of the overall attendance status of employees.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} employee - Employee ID to clock in
     */
    function ClockOut (bezl
                    , employee) {

        bezl.dataService.add('ClockOut_' + employee,'brdb', bezl.vars.config.pluginInstance,'ExecuteNonQuery', { 
            "QueryName": "UpdateLaborHead",
            "Parameters": [
                { "Key": "EmployeeID", "Value": employee }
            ] },0);
    }

    /**
     * Start the provided job for the specified employee.  This function expect the custom table BEZLIO_LABOR_DETAILS
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} employee - Employee ID to clock in
     * @param {string} baseId - The work order base ID to clock onto
     * @param {string} lotId - The work order lot ID to clock onto
     * @param {string} splitId - The work order split ID to clock onto
     * @param {string} subId - The work order sub ID to clock onto
     * @param {Number} oprSeq - The operation sequence to clock onto
     * @param {Boolean} setup - Indicates this activity should be started for Setup
     */
    function StartJob (bezl
                    , employee
                    , baseId
                    , lotId
                    , splitId
                    , subId
                    , oprSeq
                    , setup) {

        bezl.dataService.add('StartJob_' + employee,'brdb', bezl.vars.config.pluginInstance,'ExecuteNonQuery', { 
            "QueryName": "InsertLaborDetail",
            "Parameters": [
                { "Key": "EmployeeID", "Value": employee },
                { "Key": "TransactionType", "Value": (setup) ? 'SETUP' : 'RUN' },
                { "Key": "BaseId", "Value": baseId },
                { "Key": "LotId", "Value": lotId },
                { "Key": "SplitId", "Value": splitId },
                { "Key": "SubId", "Value": subId },
                { "Key": "SeqNo", "Value": oprSeq }
            ] },0);

    }
 
    return {
        clockIn: ClockIn,
        clockOut: ClockOut,
        startJob: StartJob
    }
});