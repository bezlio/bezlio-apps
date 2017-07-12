define(function () {
 
    /**
     * Clocks in one or many employees into VISUAL.  Function simply creates BRDB call so monitor
     * for return in onDataChange.  
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} plugin - The plugin name (Visual8)
     * @param {string} connection - The nammed connection as specified in Epicor905.dll.config
     * @param {string} site - The site ID within Visual
     * @param {Object[]} employees - An array of employee IDs
     * @param {string} defaultIndirect - Default indirect code to clock employees onto
     */
    function ClockIn (bezl
                    , plugin
                    , connection
                    , site
                    , employees
                    , defaultIndirect) {

        var ds = { LABOR: [] };
        employees.forEach(e => {
            ds.LABOR.push({
                TRANSACTION_TYPE: "INDIRECT",
                TRANSACTION_DATE: new Date(new Date().setHours(0, 0, 0, 0)),
                EMPLOYEE_ID: e,
                CLOCK_IN: new Date(),
                CLOCK_OUT: new Date(),
                SITE_ID: site,
                INDIRECT_ID: defaultIndirect
            });
        });
                        
        bezl.dataService.add(
            'ClockIn'
            ,'brdb'
            ,plugin
            ,'ExecuteBOMethod'
            , { 
                "Connection"    : connection,
                "BOName"       :  "Lsa.Vmfg.ShopFloor.LaborTicket",
                "Parameters"   : [
                    { "Key": "Prepare", "Value": JSON.stringify({}) },
                    { "Key": "NewIndirectLaborRow", "Value": JSON.stringify({ entryNo: 1}) },
                    { "Key": "MergeDataSet", "Value": JSON.stringify(ds) },
                    { "Key": "Save", "Value": JSON.stringify({}) }
                ]
            },0);
    }
 
    return {
        clockIn: ClockIn
    }
});