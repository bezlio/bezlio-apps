define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "TaskTypes":
                // Pull in the task types
                bezl.dataService.add('TaskTypes','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetTaskTypes",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            default:
                break;
        }
    }

    return {
        runQuery: RunQuery
    }
});