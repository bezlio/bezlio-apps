define(function () {
 
    function AddNote (bezl) {
        bezl.dataService.add('AddCRMCall', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery',
        {
            'QueryName': 'AddCRMCall',
            'Parameters': [
                { 'Key': 'SalesRep', 'Value': bezl.env.currentUser },
                { 'Key': 'CustID', 'Value': bezl.vars.selectedCustomer.CustID },
                { 'Key': 'CallDate', 'Value': new Date().toISOString().substring(0, 10) },
                { 'Key': 'CallType', 'Value': bezl.vars.newNote.type },
                { 'Key': 'ShortSummary', 'Value': bezl.vars.newNote.shortSummary },
                { 'Key': 'Details', 'Value': bezl.vars.newNote.details }
            ]
        }
        , 0);

        bezl.dataService.add('UpdateCustomer', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery',
        {
            'QueryName': 'UpdateCustomer',
            'Parameters': [
                { 'Key': 'CustID', 'Value': bezl.vars.selectedCustomer.CustID },
                { 'Key': 'LastContact', 'Value': new Date().toISOString().substring(0, 10) }
            ]
        }
        , 0);

        bezl.vars.loading.addHistory = true;
    }

    function UpdateTasks (bezl) {
        for (var i = 0; i < bezl.data.OpenTasks.length; i++) {
            var ds = { "Task": [] };
            if (bezl.data.OpenTasks[i].RowState == 'Added' || bezl.data.OpenTasks[i].RowState == 'Updated') {
                bezl.dataService.add('UpdateTask', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery',
                {
                    'QueryName': ((bezl.data.OpenTasks[i].RowState == 'Added') ? 'AddTask' : 'UpdateTask'),
                    'Parameters': [
                        { 'Key': 'SalesRep', 'Value': bezl.env.currentUser },
                        { 'Key': 'CustID', 'Value': bezl.vars.selectedCustomer.CustID },
                        { 'Key': 'TaskID', 'Value': bezl.data.OpenTasks[i].TaskID },
                        { 'Key': 'TaskDescription', 'Value': bezl.data.OpenTasks[i].TaskDescription },
                        { 'Key': 'StartDate', 'Value': bezl.data.OpenTasks[i].StartDate },
                        { 'Key': 'DueDate', 'Value': bezl.data.OpenTasks[i].DueDate },
                        { 'Key': 'PercentComplete', 'Value': bezl.data.OpenTasks[i].PercentComplete },
                        { 'Key': 'PriorityCode', 'Value': bezl.data.OpenTasks[i].PriorityCode },
                        { 'Key': 'Complete', 'Value': 0 }
                    ]
                }
                , 0);

                bezl.vars.loading.updateTask = true;
            }
        };
    }

    function AddTask (bezl) {
        bezl.data.OpenTasks.push(
                {
                "CustID" 	        :	bezl.vars.selectedCustomer.CustID
                ,"TaskID"			:	+ new Date()
                ,"TaskDescription"  :	""
                ,"SalesRepCode"	    :	bezl.vars.selectedCustomer.SalesRep
                ,"StartDate"		:	new Date()
                ,"DueDate"			:	new Date()
                ,"PercentComplete"	:	0
                ,"TypeCode"		    :	bezl.data.TaskTypes[0].TaskType
                ,"RowState"         :   "Added"
                ,"PriorityCode"     :   0
            }
        );
    }
  
    return {
        addNote: AddNote,
        updateTasks: UpdateTasks,
        addTask: AddTask
    }
});