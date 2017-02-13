define(function () {
 
    function AddNote (bezl) {
        var ds = 
        {
            "CRMCall":
            [
                    {
                    "Company"			: 	bezl.vars.config.CompanyID
                    ,"RelatedToFile"	:	"customer"
                    ,"Key1"			    :	bezl.vars.selectedCustomer.CustNum
                    ,"Key2"			    :	""
                    ,"Key3"			    :	""
                    ,"CallDesc"		    :	bezl.vars.newNote.shortSummary
                    ,"CallText"		    :	bezl.vars.newNote.details
                    ,"CallContactType"	:	"Customer"
                    ,"CallCustNum"		:	bezl.vars.selectedCustomer.CustNum
                    ,"CallTypeCode"	    :	bezl.vars.newNote.type
                    ,"CallConNum"		:	bezl.vars.selectedCustomer.CustNum
                    ,"SalesRepCode"	    :	bezl.vars.selectedCustomer.SalesRep
                    }
            ]
        };

        bezl.dataService.add('AddCRMCall', 'brdb', 'sales-rep-addNote', 'ExecuteBOMethod',
        {
            'Parameters': [{ 'Key': 'ds', 'Value': JSON.stringify(ds) }]
        }
        , 0);

        bezl.vars.loading.addHistory = true;

    }

    function UpdateTasks (bezl) {
        for (var i = 0; i < bezl.data.OpenTasks.length; i++) {
        var ds = { "Task": [] };
        if (bezl.data.OpenTasks[i].RowState == 'Added' || bezl.data.OpenTasks[i].RowState == 'Updated') {
            ds.Task.push(
            {
                "Company"			: 	bezl.data.OpenTasks[i].CompanyID
                ,"RelatedToFile"	:	"Customer"
                ,"Key1"			    :	bezl.vars.selectedCustomer.CustNum
                ,"Key2"			    :	""
                ,"Key3"			    :	""
                ,"TaskID"			:	bezl.data.OpenTasks[i].TaskID
                ,"TaskSeqNum"		:	bezl.data.OpenTasks[i].TaskSeqNum
                ,"Complete" 		:	((bezl.data.OpenTasks[i].Complete) ? 1 : 0)
                ,"PercentComplete"	:	bezl.data.OpenTasks[i].PercentComplete
                ,"TaskDescription"  :	bezl.data.OpenTasks[i].TaskDescription
                ,"StartDate"		:	bezl.data.OpenTasks[i].StartDate
                ,"DueDate"			:	bezl.data.OpenTasks[i].DueDate
                ,"TypeCode"		    :	bezl.data.OpenTasks[i].TaskType
                ,"SalesRepCode"	    :	bezl.data.OpenTasks[i].SalesRepCode
                ,"RowMod"           : ((bezl.data.OpenTasks[i].RowState == 'Added'), 'A', 'U')
            }
            );
            
            bezl.dataService.add('UpdateTask', 'brdb', 'sales-rep-updateTasks', 'ExecuteBOMethod',
            {
                'Parameters': [{ 'Key': 'ds', 'Value': JSON.stringify(ds) }]
            }
            , 0);

            bezl.vars.loading.updateTask = true;
        }
        };
    }

    function AddTask (bezl) {
        bezl.data.OpenTasks.push(
                {
                "RelatedToFile" 	:	"Customer"
                ,"Key1"			    :	bezl.vars.selectedCustomer.CustNum
                ,"Key2"			    :	""
                ,"Key3"			    :	""
                ,"TaskID"			:	""
                ,"TaskSeqNum"		:	0
                ,"TaskDescription"  :	""
                ,"SalesRepCode"	    :	bezl.vars.selectedCustomer.SalesRep
                ,"StartDate"		:	new Date()
                ,"DueDate"			:	new Date()
                ,"PercentComplete"	:	0
                ,"RowState"			: 	"Added"
                ,"TaskType"		    :	bezl.data.TaskTypes[0].TaskType
            }
        );
    }
  
    return {
        addNote: AddNote,
        updateTasks: UpdateTasks,
        addTask: AddTask
    }
});