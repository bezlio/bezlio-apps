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

            case "GetViewDetails":
                // Pull in the header data for the logged in user
                bezl.dataService.add('viewdetails','brdb','EDI','GetViewDetails', { 
                    "QueryName": "GetViewDetails",
                    "Connection": "DEV-EDI01",
                    "Parameters": [
                        { "Key": "@HEADER_ID", "Value": bezl.vars.EDI_SL_DASH_HEADER_ID }
                    ] },0);

                break;

            case "GetViewFile":
                // Pull in the header data for the logged in user
                bezl.dataService.add('viewfile','brdb','EDI','GetViewFile', { 
                    "QueryName": "GetViewFile",
                    "Connection": "DEV-EDI01",
                    "Parameters": [
                        { "Key": "@HEADER_ID", "Value": bezl.vars.EDI_SL_DASH_HEADER_ID }
                    ] },0);

                break;

            case "Revalidate":
                var parameters = [], parameterCount = 0

                //Loop through header for header information.
                for (var key in bezl.vars.viewdetails.HEADER){
                    var obj = bezl.vars.viewdetails.HEADER[key];

                    for (var prop in obj) {
                        switch (prop.toString()){
                            case "DESIRED_SHIP_DATE":
                                parameters[parameterCount] = { "Key": "@DESIRED_SHIP_DATE", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "DOCUMENT_TYPE":
                                parameters[parameterCount] = { "Key": "@DOCUMENT_TYPE", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "EDI_SL_FILE_ID":
                                parameters[parameterCount] = { "Key": "@EDI_SL_FILE_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "EDI_SL_DASH_HEADER_ID":
                                parameters[parameterCount] = { "Key": "@HEADER_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "ORDER_STATUS":
                                parameters[parameterCount] = { "Key": "@ORDER_STATUS", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "SHIP_VIA":
                                parameters[parameterCount] = { "Key": "@SHIP_VIA", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "SHIPTO_ID":
                                parameters[parameterCount] = { "Key": "@SHIPTO_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                        }
                    }
                }
                
                //Loop through overrides for override information.
                for (var key in bezl.vars.viewdetails.OVERRIDES){
                    var obj = bezl.vars.viewdetails.OVERRIDES[key];

                    for (var prop in obj) {
                        parameters[parameterCount] = { "Key": "@OVERRIDES_" + prop.toString(), "Value": obj[prop] };
                        parameterCount = parameterCount + 1;
                    }
                }

                //Loop through overrides for override information.
                for (var key in bezl.vars.viewdetails.ITEMS){
                    var obj = bezl.vars.viewdetails.ITEMS[key];
                    
                    for (var prop in obj) {
                        parameters[parameterCount] = { "Key": "@ITEMS_" + prop.toString(), "Value": obj[prop] };
                        parameterCount = parameterCount + 1;
                    }
                }

                // Pull in the header data for the logged in user
                bezl.dataService.add('viewdetails','brdb','EDI','Revalidate', { 
                    "QueryName": "Revalidate",
                    "Connection": "DEV-EDI01",
                    "Parameters": parameters },0);

                break;
            case "Save":
                var parameters = [], parameterCount = 0

                //Loop through header for header information.
                for (var key in bezl.vars.viewdetails.HEADER){
                    var obj = bezl.vars.viewdetails.HEADER[key];

                    for (var prop in obj) {
                        switch (prop.toString()){
                            case "DESIRED_SHIP_DATE":
                                parameters[parameterCount] = { "Key": "@DESIRED_SHIP_DATE", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "DOCUMENT_TYPE":
                                parameters[parameterCount] = { "Key": "@DOCUMENT_TYPE", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "EDI_SL_FILE_ID":
                                parameters[parameterCount] = { "Key": "@EDI_SL_FILE_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "EDI_SL_DASH_HEADER_ID":
                                parameters[parameterCount] = { "Key": "@HEADER_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "ORDER_STATUS":
                                parameters[parameterCount] = { "Key": "@ORDER_STATUS", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "SHIP_VIA":
                                parameters[parameterCount] = { "Key": "@SHIP_VIA", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "SHIPTO_ID":
                                parameters[parameterCount] = { "Key": "@SHIPTO_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                        }
                    }
                }
                
                //Loop through overrides for override information.
                for (var key in bezl.vars.viewdetails.OVERRIDES){
                    var obj = bezl.vars.viewdetails.OVERRIDES[key];

                    for (var prop in obj) {
                        parameters[parameterCount] = { "Key": "@OVERRIDES_" + prop.toString(), "Value": obj[prop] };
                        parameterCount = parameterCount + 1;
                    }
                }

                //Loop through overrides for override information.
                for (var key in bezl.vars.viewdetails.ITEMS){
                    var obj = bezl.vars.viewdetails.ITEMS[key];
                    
                    for (var prop in obj) {
                        parameters[parameterCount] = { "Key": "@ITEMS_" + prop.toString(), "Value": obj[prop] };
                        parameterCount = parameterCount + 1;
                    }
                }

                // Pull in the header data for the logged in user
                bezl.dataService.add('viewdetails','brdb','EDI','SaveDetails', { 
                    "QueryName": "SaveDetails",
                    "Connection": "DEV-EDI01",
                    "Parameters": parameters },0);

                break;

            case "DELETE":
                var parameters = [], parameterCount = 0

                //Loop through header for header information.
                for (var key in bezl.vars.viewdetails.HEADER){
                    var obj = bezl.vars.viewdetails.HEADER[key];

                    for (var prop in obj) {
                        switch (prop.toString()){
                            case "APPROVE":
                                parameters[parameterCount] = { "Key": "@APPROVE", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "EDI_SL_DASH_HEADER_ID":
                                parameters[parameterCount] = { "Key": "@HEADER_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                        }
                    }
                }

                // Pull in the header data for the logged in user
                bezl.dataService.add('datasub','brdb','EDI','Delete', { 
                    "QueryName": "Delete",
                    "Connection": "DEV-EDI01",
                    "Parameters": parameters },0);

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