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

    return {
        filterEdiStatus: FilterEdiStatus,
        runQuery: RunQuery,
        filterBy: FilterBy
    }
});