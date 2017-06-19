define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "RMAs":
                bezl.vars.loading = true; 


                // Pull in the accounts list for the logged in user
                bezl.dataService.add('RMAs','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "RMAInquiry",
                    "Parameters": [
                        { "Key": "StartDate", "Value": bezl.vars.startDate || '01/01/1900'},
                        { "Key": "EndDate", "Value": bezl.vars.endDate || '01/01/2100'},
                        { "Key": "CustID", "Value": bezl.vars.selectedAccount.ID || ""}
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
            case 'GetAllRMAs':
                bezl.vars.loading = true;
                // Get All Orders associated with user
                bezl.dataService.add('RMAs','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "RMAInquiryAll",
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

    function Select(bezl, RMA) {
        // Mark the selected customer as selected
        for (var i = 0; i < bezl.vars.RMAs.length; i++) {
            if (bezl.vars.RMAs[i].RMANum == RMA.RMANum) {
                bezl.vars.RMAs[i].Selected = !bezl.vars.RMAs[i].Selected;

                if (bezl.vars.RMAs[i].Selected) {
                    localStorage.setItem('selectedRMA', JSON.stringify(bezl.vars.RMAs[i]));
                    $('#bezlpanel').trigger('selectedRMA', [bezl.vars.RMAs[i]]);
                } else {
                    localStorage.setItem('selectedRMA', '');
                    $('#bezlpanel').trigger('selectedRMA', [{}]);
                }
                
            } else {
                bezl.vars.RMAs[i].Selected = false;
            }
        };
    }

    function Filter(bezl) {
        // Filter, will hide the table rows that do not match filter
        var tr, td;
        tr = document.getElementById("RMAList").getElementsByTagName("tr");

        // Loop through all rows
        for(var i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if(td) {
                if(td.innerHTML.toUpperCase().indexOf(bezl.vars.filter.toUpperCase()) > -1) {
                    tr[i].style.display = "";
                } else {
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
        if (sortColumn == "RMANum") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.RMAs.sort(function (a, b) {
                    var A = a[sortColumn];
                    var B = b[sortColumn];
                    return A - B;
                });
            } else {
                bezl.vars.RMAs.sort(function (a, b) {
                    var A = a[sortColumn];
                    var B = b[sortColumn];
                    return B - A;
                });
            }
        } else if (sortColumn == "RMADate") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.RMAs.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.RMAs.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    return B - A;
                });
            } 
        } else {
            if (bezl.vars.sort == "asc") { 
                bezl.vars.RMAs.sort(function(a, b) {
                    var A = a[sortColumn].toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn].toUpperCase(); // ignore upper and lowercase
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
                bezl.vars.RMAs.sort(function(a, b) {
                    var A = a[sortColumn].toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn].toUpperCase(); // ignore upper and lowercase
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
        if (bezl.vars.sortInner == sortColumn) {
            if (bezl.vars.sortInner == "desc") {
                bezl.vars.sortInner = "asc";
            } else {
                bezl.vars.sortInner = "desc";
            }
        } else {
            bezl.vars.sortInner = "asc";
        }
        
        // Store the sort column so the UI can reflect it
        bezl.vars.sortColInner = sortColumn;


        // Test for numeric sort columns, otherwise sort alphabetic
        if (sortColumn == "RMALine" || sortColumn == "UnitPrice" || sortColumn == "ExtPrice" || sortColumn == "Qty") {
            if (bezl.vars.sortInner == "asc") {
                bezl.vars.RMAs.sort(function (a, b) {
                     a = JSON.parse(localStorage.getItem("selectedRMA"));
                   var A = new Array();
                   var B = new Array();

                    for( var i = 0; i < a.RMALines.length; i++){
                        A.push(a.RMALines[i][sortColumn]);
                        B.push(a.RMALines[i][sortColumn]);
                    }
                    B.reverse();
                    console.log(parseFloat(A) - parseFloat(B));
                    return parseFloat(A) - parseFloat(B);
                });
            } else {
                bezl.vars.RMAs.sort(function (a, b) {
                    a = JSON.parse(localStorage.getItem("selectedRMA"));
                   var A = new Array();
                   var B = new Array();

                    for( var i = 0; i < a.RMALines.length; i++){
                        A.push(a.RMALines[i][sortColumn]);
                        B.push(a.RMALines[i][sortColumn]);
                    }
                    B.reverse();
                    return parseFloat(B) - parseFloat(A);
                });
            }
        } else {
            if (bezl.vars.sortInner == "asc") { 
                bezl.vars.RMAs.sort(function(a, b) {
                    var A = a[sortColumn].toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn].toUpperCase(); // ignore upper and lowercase
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
                bezl.vars.RMAs.sort(function(a, b) {
                    var A = a[sortColumn].toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn].toUpperCase(); // ignore upper and lowercase
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

        bezl.vars.RMAs = [];
        var cust = bezl.vars.custList.find(c => c.ID == custId);
        bezl.vars.selectedAccount = cust;
        if(custId == "ALL_ACCOUNTS" ){
            this.runQuery(bezl, 'GetAllRMAs');
        } else {
            this.runQuery(bezl, 'RMAs');
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
