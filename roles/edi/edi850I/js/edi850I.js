define(function () {
    function FilterEdiStatus(bezl) {
        // FilterEdiStatus, will hide the table rows that are not in the correct filter status.
        var tr, td, div;

        //Get bezl rows in mainTable.
        tr = $(bezl.container.nativeElement).find("#mainTable tr")

        // Loop through all rows
        for(var i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            
            if(td) {
                div = td.getElementsByTagName("div")
                ediStatus = div[8].innerHTML;
             
                //If not the correct edi status, hide the row.
                if(ediStatus.toUpperCase().indexOf(bezl.vars.filterEdiStatus.toUpperCase()) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }      
    }
  
    function RunQuery (bezl, queryName) {
        switch (queryName) {
            case "GetDashHeaderData":
                // Pull in the header data for the logged in user
                bezl.dataService.add('datasub','brdb','EDI','GetDashHeaderData', { 
                    "QueryName": "GetDashHeaderData",
                    "Connection": "DEV-EDI01",
                    "Parameters": [
                        { "Key": "@SITE_ID", "Value": ' ' },
                        { "Key": "@USER_ID", "Value": '1' },
                        { "Key": "@DOC_TYPE", "Value": '850' },
                        { "Key": "@SEARCHVALUE", "Value": bezl.vars.search }
                    ] },0);

                break;
        }
    }
    
    function FilterBy(bezl) {
        // Filter, will hide the table rows that are not in the filter.
        var tr, td, div, found, ediStatus;

        //Get bezl rows in mainTable.
        tr = $(bezl.container.nativeElement).find("#mainTable tr")

        // Loop through all rows
        for(var i = 0; i < tr.length; i++) {
            found = false;
            
            for(var j = 0; j < tr[i].cells.length; j++) {
                td = tr[i].getElementsByTagName("td")[j];

                if(td) {
                    div = td.getElementsByTagName("div")
                    ediStatus = div[8].innerHTML;

                    //If not the correct edi status, hide the row.
                    if(td.innerHTML.toUpperCase().indexOf(bezl.vars.filter.toUpperCase()) > -1 && ediStatus.toUpperCase().indexOf(bezl.vars.filterEdiStatus.toUpperCase()) > -1) {
                        found = true;
                    }
                }
            }

            if (found || i == 0) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
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

        // Test for numeric sort columns, date sort columns, otherwise sort alphabetic
        if (sortColumn == "APPROVE") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.datasub.sort(function (a, b) {
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
        } else if (sortColumn == "DESIRED_SHIP_DATE" || sortColumn == "ORDER_DATE" || sortColumn == "CHANGE_DATE") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.datasub.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.datasub.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    return B - A;
                });
            } 
        } else {
            if (bezl.vars.sort == "asc") { 
                bezl.vars.datasub.sort(function(a, b) {
                    if (a[sortColumn] == null){
                        return -1
                    }
                    
                    if (b[sortColumn] == null){
                        return 1;
                    }

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
                bezl.vars.datasub.sort(function(a, b) {
                    if (a[sortColumn] == null){
                        return 1
                    }
                    
                    if (b[sortColumn] == null){
                        return -1;
                    }

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

    return {
        filterEdiStatus: FilterEdiStatus,
        runQuery: RunQuery,
        filterBy: FilterBy,
        sort: Sort
    }
});