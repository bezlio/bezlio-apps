define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "CustList":
                bezl.vars.loading = true; 

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

    function Select(bezl, customer) {
        // Mark the selected customer as selected
        for (var i = 0; i < bezl.data.CustList.length; i++) {
            if (bezl.data.CustList[i].CustID == customer.CustID) {
                bezl.data.CustList[i].Selected = !bezl.data.CustList[i].Selected;
            } else {
                bezl.data.CustList[i].Selected = false;
            }
        };
    }
  
    return {
        runQuery: RunQuery,
        select: Select
    }
});