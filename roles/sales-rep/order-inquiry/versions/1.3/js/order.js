define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "Orders":
                bezl.vars.loading = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('Orders','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "OrderInquiry",
                    "Parameters": [
                        { "Key": "StartDate", "Value": bezl.vars.startDate || "01/01/1900"},
                        { "Key": "EndDate", "Value": bezl.vars.endDate || "01/01/2100"},
                        { "Key": "CustID", "Value": bezl.vars.selectedAccount.ID || ""},
                        { "Key": "Company", "Value": 'All' }
                    ] },0);
                break;
            case 'Accounts':
                bezl.vars.loading = true;
                // Get All Accounts associated with user
                bezl.dataService.add('Accounts','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccounts",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0); 
                break; 
            case 'GetAllOrders':
                bezl.vars.loading = true;
                // Get All Orders associated with user
                bezl.dataService.add('Orders','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAllOrders",
                    "Parameters": [
                      	{ "Key": "EmailAddress", "Value": bezl.env.currentUser },
                        { "Key": "StartDate", "Value": bezl.vars.startDate || "01/01/1900"},
                        { "Key": "EndDate", "Value": bezl.vars.endDate || "01/01/2100"},
                        { "Key": "Company", "Value": 'All' }
                    ] },0);
                break;         
            default:
                break;
        }
    }

    function Select(bezl, Order) {
        // Mark the selected customer as selected
        for (var i = 0; i < bezl.vars.Orders.length; i++) {
            if (bezl.vars.Orders[i].OrderNum == Order.OrderNum) {
                bezl.vars.Orders[i].Selected = !bezl.vars.Orders[i].Selected;

                if (bezl.vars.Orders[i].Selected) {
                    localStorage.setItem('selectedOrder', JSON.stringify(bezl.vars.Orders[i]));
                    $('#bezlpanel').trigger('selectedOrder', [bezl.vars.Orders[i]]);
                } else {
                    localStorage.setItem('selectedOrder', '');
                    $('#bezlpanel').trigger('selectedOrder', [{}]);
                }
                
            } else {
                bezl.vars.Orders[i].Selected = false;
            }
        };
    }

    function Filter(bezl) {
        // Filter, will hide the table rows that do not match filter
        var tr, td;
        tr = document.getElementById("orderList").getElementsByTagName("tr");

        // We need to re-calculate the sum of the total amount of filtered orders as well
        bezl.vars.OrdersTotalAmount = 0.0;

        // Loop through all rows
        for(var i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];

            if(td) {
                if(bezl.vars.filter.toUpperCase() == "ALL") 
                {
                    tr[i].style.display = "";
                    bezl.vars.OrdersTotalAmount += Number(td.children[0].children[3].innerHTML.replace(/[^0-9\.-]+/g,""));
                } else if(td.children[0].children[4].innerHTML.toUpperCase().indexOf(bezl.vars.filter.toUpperCase()) > -1){
                    tr[i].style.display = "";
                    bezl.vars.OrdersTotalAmount += Number(td.children[0].children[3].innerHTML.replace(/[^0-9\.-]+/g,""));
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
        
    }

    function Sort(bezl, sortColumn) {

        // If the previous sort column was picked, make it the opposite sort
        if (bezl.vars.sortCol == sortColumn) {
            if (bezl.vars.sort == "desc") {
                bezl.vars.sort = "asc";
            } else {
                bezl.vars.sort = "desc";
            }
        } else {
            bezl.vars.sort = "asc";
        }
        
        // Store the sort column so the UI can reflect it
        bezl.vars.sortCol = sortColumn;


        // Test for numeric sort columns, otherwise sort alphabetic
        if (sortColumn == "OrderAmt" || sortColumn == "OrderNum") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.Orders.sort(function (a, b) {
                    var A = a[sortColumn];
                    var B = b[sortColumn];
                    return A - B;
                });
            } else {
                bezl.vars.Orders.sort(function (a, b) {
                    var A = a[sortColumn];
                    var B = b[sortColumn];
                    return B - A;
                });
            }
        } else if (sortColumn == "OrderDate" ) {
            if (bezl.vars.sort == "asc") {
                bezl.vars.Orders.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.Orders.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    return B - A;
                });
            } 
        } else {
            if (bezl.vars.sort == "asc") { 
                bezl.vars.Orders.sort(function(a, b) {
                    var A = a[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    if (A < B) {
                        return -1;
                    }
                    if (A > B) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
            } else {
                bezl.vars.Orders.sort(function(a, b) {
                    var A = a[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    if (A > B) {
                        return -1;
                    }
                    if (A < B) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
            }
        }
    }

    function InnerSort(bezl, sortColumn) {

        // If the previous sort column was picked, make it the opposite sort
        if (bezl.vars.sortCol == sortColumn) {
            if (bezl.vars.sortInner == "desc") {
                bezl.vars.sortInner = "asc";
            } else {
                bezl.vars.sortInner = "desc";
            }
        } else {
            bezl.vars.sortInner = "asc";
        }
        
        // Store the sort column so the UI can reflect it
        bezl.vars.sortCol = sortColumn;


        // Test for numeric sort columns, otherwise sort alphabetic
        if (sortColumn == "LineNum" || sortColumn == "PartNum" || sortColumn == "InvoiceQty" || sortColumn == "ExtPrice" || sortColumn == "ShippedQty" || sortColumn == "UnitPrice") {
            if (bezl.vars.sortInner == "asc") {
                bezl.vars.Orders.sort(function (a, b) {
                    var A = a[sortColumn] || Number.MAX_SAFE_INTEGER;
                    var B = b[sortColumn] || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.Orders.sort(function (a, b) {
                    var A = a[sortColumn] || Number.MAX_SAFE_INTEGER;
                    var B = b[sortColumn] || Number.MAX_SAFE_INTEGER;
                    return B - A;
                });
            }
        } else {
            if (bezl.vars.sortInner == "asc") { 
                bezl.vars.Orders.sort(function(a, b) {
                    var A = a[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    if (A < B) {
                        return -1;
                    }
                    if (A > B) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
            } else {
                bezl.vars.Orders.sort(function(a, b) {
                    var A = a[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    if (A > B) {
                        return -1;
                    }
                    if (A < B) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
            }
        }
    }
   function CustSelection(bezl, custId) {

        bezl.vars.Orders = [];
        var cust = bezl.vars.custList.find(c => c.ID == custId);
        bezl.vars.selectedAccount = cust;
        if(custId == "ALL_ACCOUNTS" ){
            this.runQuery(bezl, 'GetAllOrders');
        } else {
            this.runQuery(bezl, 'Orders');
        }
    }
  
    return {
        runQuery: RunQuery,
        select: Select,
        filter: Filter,
        sort: Sort,
        innerSort: InnerSort,
        custSelection: CustSelection
    }
});
