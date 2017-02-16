define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "CustList":
                // Pull in the customer list for the logged in user
                bezl.dataService.add('CustList','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetCustomersWithAddress",
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