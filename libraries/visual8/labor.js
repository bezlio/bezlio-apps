define(function () {
 
    /**
     * Clocks in an employee into VISUAL. This function expect the custom table BEZLIO_LABOR_HEAD
     * which is used to keep track of the overall attendance status of employees.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} employee - Employee ID to clock in
     * @param {string} pluginInstance - BRDB plugin instance to use for write transaction
     */
    function ClockIn (bezl
                    , employee
                    , pluginInstance) {

        bezl.dataService.add('ClockIn_' + employee,'brdb', pluginInstance,'ExecuteNonQuery', { 
            "QueryName": "InsertLaborHead",
            "Parameters": [
                { "Key": "EmployeeID", "Value": employee }
            ] },0);
    }

    /**
     * Clocks out an employee into VISUAL. This function expect the custom table BEZLIO_LABOR_HEAD
     * which is used to keep track of the overall attendance status of employees.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} employee - Employee ID to clock out
     * @param {string} pluginInstance - BRDB plugin instance to use for write transaction
     */
    function ClockOut (bezl
                    , employee) {

        bezl.dataService.add('ClockOut_' + employee,'brdb', pluginInstance,'ExecuteNonQuery', { 
            "QueryName": "UpdateLaborHead",
            "Parameters": [
                { "Key": "EmployeeID", "Value": employee }
            ] },0);
    }

    /**
     * Starts the provided job on the specified employee by creating a real labor ticket within VISUAL using the .Net objects
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} siteId - VISUAL site ID
     * @param {string} employee - Employee ID
     * @param {string} baseId - The work order base ID to clock onto
     * @param {string} lotId - The work order lot ID to clock onto
     * @param {string} splitId - The work order split ID to clock onto
     * @param {string} subId - The work order sub ID to clock onto
     * @param {Number} oprSeq - The operation sequence to clock onto
     * @param {Boolean} setup - Indicates this activity should be started for Setup
     */
    function StartJob (bezl
                    , connection
                    , siteId
                    , employee
                    , baseId
                    , lotId
                    , splitId
                    , subId
                    , oprSeq
                    , setup) {

        var ds = { LABOR: [
            {
                TRANSACTION_TYPE: ((setup) ? "SETUP" : "RUN"),
                TRANSACTION_DATE: new Date(new Date().setHours(0, 0, 0, 0)),
                EMPLOYEE_ID: employee,
                CLOCK_IN: new Date(),
                CLOCK_OUT: new Date(),
                SITE_ID: siteId,
                BASE_ID: baseId,
                LOT_ID: lotId,
                SPLIT_ID: splitId,
                SUB_ID: subId,
                SEQ_NO: oprSeq,
                START_IN_PROCESS_TICKET: true
            }
        ] };
        
        bezl.dataService.add(
            'StartJob_' + employee
            ,'brdb'
            ,'Visual8'
            ,'ExecuteBOMethod'
            , { 
                "Connection"    : connection,
                "BOName"       :  "Lsa.Vmfg.ShopFloor.LaborTicket",
                "Parameters"   : [
                    { "Key": "Prepare", "Value": JSON.stringify({}) },
                    { "Key": ((setup) ? "NewSetupLaborRow" : "NewRunLaborRow"), "Value": JSON.stringify({ entryNo: 1}) },
                    { "Key": "MergeDataSet", "Value": JSON.stringify(ds) },
                    { "Key": "Save", "Value": JSON.stringify({}) }
                ]
            },0);
    }

    /**
     * Write a work order labor ticket to VISUAL.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} siteId - VISUAL site ID
     * @param {string} employee - Employee ID
     * @param {string} baseId - The work order base ID to clock onto
     * @param {string} lotId - The work order lot ID to clock onto
     * @param {string} splitId - The work order split ID to clock onto
     * @param {string} subId - The work order sub ID to clock onto
     * @param {Number} oprSeq - The operation sequence to clock onto
     * @param {Boolean} setup - Indicates this activity should be started for Setup
     * @param {datetime} clockIn - Activity clock in time
     * @param {datetime} clockOut - Activity clock out time
     * @param {decimal} hoursWorked - Hours Worked
     * @param {decimal} hoursBreak - Break hours
     * @param {decimal} deviatedQty - Scrap
     */
    function WriteWorkOrderLaborTicket (bezl
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
        startJob: StartJob,
        writeWorkOrderLaborTicket: WriteWorkOrderLaborTicket
    }
});