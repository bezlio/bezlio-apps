define(function () {
    /**
     * Adds a CRM Call for the specified customer.  Function simply creates BRDB call so monitor
     * for return in onDataChange.  
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} plugin - The plugin name (Epicor10, Epicor905)
     * @param {string} connection - The nammed connection as specified in Epicor*.dll.config
     * @param {string} company - The company ID within Epicor
     * @param {Number} custNum - The customer number to add this call for
     * @param {string} shortSummary - The short summary for the call (CallDesc)
     * @param {string} details - The details for the call (CallText)
     * @param {string} type - The CRM call type
     * @param {string} salesRep - The sales rep code to associate with this call
     */
    function AddNote (bezl,
                      plugin,
                      connection,
                      company,
                      custNum,
                      shortSummary,
                      details,
                      type,
                      salesRep) {
        var ds = 
        {
            'CRMCall':
            [
                    {
                    'Company'			: 	company
                    ,'RelatedToFile'	:	'customer'
                    ,'Key1'			    :	custNum
                    ,'Key2'			    :	''
                    ,'Key3'			    :	''
                    ,'CallDesc'		    :	shortSummary
                    ,'CallText'		    :	details
                    ,'CallContactType'	:	'Customer'
                    ,'CallCustNum'		:	custNum
                    ,'CallTypeCode'	    :	type
                    ,'SalesRepCode'	    :	salesRep
                    }
            ]
        };

        bezl.dataService.add(
            'AddCRMCall'
            , 'brdb'
            , plugin
            , 'ExecuteBOMethod'
            , {
                "Connection"    : connection,
                "Company"       : company,
                'BOName'        : 'CRMCall',
                'BOMethodName'  : 'UpdateExt',
                'Parameters': [{ 'Key': 'ds', 'Value': JSON.stringify(ds) }]
            }
            , 0);

        bezl.vars.addingHistory = true;

    }

    /**
     * Returns an Epicor-compatible new Task row that can later be saved as a 
     * part of an UpdateExt
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {Number} custNum - The customer number to add this task for
     * @param {string} salesRep - The sales rep code to associate with this task
     * @param {string} taskType - The task type code for this new task
     */
    function GetNewTask(custNum,
                        salesRepCode,
                        taskType) {
        return {       
                "CustNum"			:	custNum
                ,"TaskID"			:	""
                ,"TaskSeqNum"		:	0
                ,"TaskDescription"  :	""
                ,"SalesRepCode"	    :	salesRepCode
                ,"StartDate"		:	new Date()
                ,"DueDate"			:	new Date()
                ,"PercentComplete"	:	0
                ,"RowState"			: 	"Added"
                ,"TaskType"		    :	taskType
            };
    }

    /**
     * Updates the dataset of tasks in Epicor using UpdateExt
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {Object[]} tasks - An array of tasks
     */
    function UpdateTasks(bezl
                        , tasks) {

        var ds = { "Task": [] };
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].RowState == 'Added' || tasks[i].RowState == 'Updated') {
                ds.Task.push(
                {
                    "Company"			: 	tasks[i].Company
                    ,"RelatedToFile"	:	"Customer"
                    ,"Key1"			    :	tasks[i].CustNum
                    ,"Key2"			    :	""
                    ,"Key3"			    :	""
                    ,"TaskID"			:	tasks[i].TaskID
                    ,"TaskSeqNum"		:	tasks[i].TaskSeqNum
                    ,"Complete" 		:	((tasks[i].Complete) ? 1 : 0)
                    ,"PercentComplete"	:	tasks[i].PercentComplete
                    ,"TaskDescription"  :	tasks[i].TaskDescription
                    ,"StartDate"		:	tasks[i].StartDate
                    ,"DueDate"			:	tasks[i].DueDate
                    ,"TypeCode"		    :	tasks[i].TaskType
                    ,"SalesRepCode"	    :	tasks[i].SalesRepCode
                    ,"RowMod"           : ((tasks[i].RowState == 'Added'), 'A', 'U')
                }
                );
            }
        }

        bezl.dataService.add('UpdateTasks', 'brdb', 'sales-rep-updateTasks', 'ExecuteBOMethod',
        {
            'Parameters': [{ 'Key': 'ds', 'Value': JSON.stringify(ds) }]
        }
        , 0);
    }

    return {
        addNote: AddNote,
        getNewTask: GetNewTask,
        updateTasks: UpdateTasks
    }
});