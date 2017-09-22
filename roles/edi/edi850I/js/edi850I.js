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

        //Get bezl rows in mainTableMobile.
        tr = $(bezl.container.nativeElement).find("#mainTableMobile tr")

        // Loop through all rows
        for(var i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            
            if(td.length > 0) {
                ediStatus = td[6].innerHTML;
              
                //If not the correct edi status, hide the row.
                if(ediStatus.toUpperCase().indexOf(bezl.vars.filterEdiStatus.toUpperCase()) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        } 

        //Make buttons visible/invisible.
        if (bezl.vars.filterEdiStatus == 'H'){
            var div = document.getElementById('btnDelete');
            div.style.display = '';
            var div = document.getElementById('btnApprove');
            div.style.display = '';
            var div = document.getElementById('btnDeleteMobile');
            div.style.display = '';
            var div = document.getElementById('btnApproveMobile');
            div.style.display = '';
        }     
        else if (bezl.vars.filterEdiStatus == 'A' || bezl.vars.filterEdiStatus == 'D'){
            var div = document.getElementById('btnDelete');
            div.style.display = 'none';
            var div = document.getElementById('btnApprove');
            div.style.display = 'none';  
            var div = document.getElementById('btnDeleteMobile');
            div.style.display = 'none';
            var div = document.getElementById('btnApproveMobile');
            div.style.display = 'none';  
        }

        //Loop through user for user rights.
        for (var key in bezl.vars.user.USER_DOCS){
            var obj = bezl.vars.user.USER_DOCS[key];

            if (obj["DOCUMENT_TYPE"] == '850'){
                for (var prop in obj) {
                    switch (prop.toString()){
                        case "MODIFY_DOC":
                            if (obj[prop] == false){
                                    //Make buttons visible/invisible.
                                    var div = document.getElementById('btnApprove');
                                    div.style.display = 'none';
                                    var div = document.getElementById('btnDelete');
                                    div.style.display = 'none';  
                                    var div = document.getElementById('btnApproveMobile');
                                    div.style.display = 'none';
                                    var div = document.getElementById('btnDeleteMobile');
                                    div.style.display = 'none';  
                            }
                    }
                }
            }
        }
    }
    
    function SelectAll(bezl) {
        for (var key in bezl.vars.main){
            var obj = bezl.vars.main[key];

            if (obj['EDI_STATUS'] == bezl.vars.filterEdiStatus){
                obj['APPROVE'] = true;
            }
        }
    }

    function SelectNone(bezl) {
        for (var key in bezl.vars.main){
            var obj = bezl.vars.main[key];

            if (obj['EDI_STATUS'] == bezl.vars.filterEdiStatus){
                obj['APPROVE'] = false;
            }
        }
    }

    function RunQuery (bezl, queryName) {
        switch (queryName) {
            case "GetUserSettings":
                var user;
                
                //Get the current login user.
                user = bezl.env.currentUser;

                bezl.dataService.add('user','brdb','EDI','GetUserSettings', { 
                    "QueryName": "GetUserSettings",
                    "Connection": bezl.vars.config.sqlConnection,
                    "Parameters": [
                        { "Key": "@EMAIL", "Value": user },
                    ] },0);

                break;

            case "GetDashHeaderData":
                // Pull in the header data for the logged in user
                var parameters = [], parameterCount = 0;
                
                parameters[parameterCount] = { "Key": "@DOC_TYPE", "Value": '850' };
                parameterCount = parameterCount + 1;

                parameters[parameterCount] = { "Key": "@SEARCHVALUE", "Value": bezl.vars.search };
                parameterCount = parameterCount + 1;

                parameters[parameterCount] = { "Key": "@SITE_ID", "Value": bezl.vars.config.siteId };
                parameterCount = parameterCount + 1;

                //Get User ID.
                for (var key in bezl.vars.user.USERS){
                    var obj = bezl.vars.user.USERS[key];

                    for (var prop in obj){
                        switch (prop.toString()){
                            case "EDI_SL_USER_ID":
                                parameters[parameterCount] = { "Key": "@USER_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "ENABLED":
                                parameters[parameterCount] = { "Key": "@USER_ENABLED", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                        }
                    }
                }

                //Loop through user for user rights.
                for (var key in bezl.vars.user.USER_DOCS){
                    var obj = bezl.vars.user.USER_DOCS[key];
                    
                    if (obj["DOCUMENT_TYPE"] == '850'){
                        for (var prop in obj) {
                            switch (prop.toString()){
                                case "DELETE_DATE":
                                    parameters[parameterCount] = { "Key": "@USER_DOCS_DELETE_DATE", "Value": obj[prop] };
                                    parameterCount = parameterCount + 1;
                                    break;
                                case "IS_ENABLED":
                                    parameters[parameterCount] = { "Key": "@USER_DOCS_IS_ENABLED", "Value": obj[prop] };
                                    parameterCount = parameterCount + 1;
                                    break;
                                case "MODIFY_DOC":
                                    parameters[parameterCount] = { "Key": "@USER_DOCS_MODIFY_DOC", "Value": obj[prop] };
                                    parameterCount = parameterCount + 1;

                                    if (obj[prop] == false){
                                            //Make buttons visible/invisible.
                                            var div = document.getElementById('btnApprove');
                                            div.style.display = 'none';
                                            var div = document.getElementById('btnDelete');
                                            div.style.display = 'none';  
                                            var div = document.getElementById('btnApproveMobile');
                                            div.style.display = 'none';
                                            var div = document.getElementById('btnDeleteMobile');
                                            div.style.display = 'none';  
                                    }
                                    else {
                                            //Make buttons visible/invisible.
                                            var div = document.getElementById('btnApprove');
                                            div.style.display = '';
                                            var div = document.getElementById('btnDelete');
                                            div.style.display = '';  
                                            var div = document.getElementById('btnApproveMobile');
                                            div.style.display = '';
                                            var div = document.getElementById('btnDeleteMobile');
                                            div.style.display = '';  
                                    }                                   
                                    break;
                                case "VIEW_DOC":
                                    parameters[parameterCount] = { "Key": "@USER_DOCS_VIEW_DOC", "Value": obj[prop] };
                                    parameterCount = parameterCount + 1;
                                    break;
                            }
                        }
                    }
                }

                bezl.dataService.add('main','brdb','EDI','GetDashHeaderData', { 
                    "QueryName": "GetDashHeaderData",
                    "Connection": bezl.vars.config.sqlConnection,
                    "Parameters": parameters },0);

                break;

            case "GetViewDetails":
                // Pull in the header data for the logged in user
                bezl.dataService.add('viewdetails','brdb','EDI','GetViewDetails', { 
                    "QueryName": "GetViewDetails",
                    "Connection": bezl.vars.config.sqlConnection,
                    "Parameters": [
                        { "Key": "@HEADER_ID", "Value": bezl.vars.EDI_SL_DASH_HEADER_ID }
                    ] },0);

                //Make buttons visible/invisible.
                if (bezl.vars.filterEdiStatus == 'H'){
                    var div = document.getElementById('btnRevalidate');
                    div.style.display = '';
                    var div = document.getElementById('btnSave');
                    div.style.display = '';
                }     
                else if (bezl.vars.filterEdiStatus == 'A' || bezl.vars.filterEdiStatus == 'D'){
                    var div = document.getElementById('btnRevalidate');
                    div.style.display = 'none';
                    var div = document.getElementById('btnSave');
                    div.style.display = 'none';  
                }

                //Loop through user for user rights.
                for (var key in bezl.vars.user.USER_DOCS){
                    var obj = bezl.vars.user.USER_DOCS[key];

                    if (obj["DOCUMENT_TYPE"] == '850'){
                        for (var prop in obj) {
                            switch (prop.toString()){
                                case "MODIFY_DOC":
                                    if (obj[prop] == false){
                                            //Make buttons visible/invisible.
                                            var div = document.getElementById('btnRevalidate');
                                            div.style.display = 'none';
                                            var div = document.getElementById('btnSave');
                                            div.style.display = 'none';  
                                    }                               
                                    break;
                            }
                        }
                    }
                }

                break;

            case "GetViewFile":
                // Pull in the header data for the logged in user
                bezl.dataService.add('viewfile','brdb','EDI','GetViewFile', { 
                    "QueryName": "GetViewFile",
                    "Connection": bezl.vars.config.sqlConnection,
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
                            case "EDI_DIRECTION":
                                parameters[parameterCount] = { "Key": "@EDI_DIRECTION", "Value": obj[prop] };
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
                    "Connection": bezl.vars.config.sqlConnection,
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
                    "Connection": bezl.vars.config.sqlConnection,
                    "Parameters": parameters },0);

                break;

            case "Delete":
                var parameters = [], parameterCount = 0

                //Loop through header for header information.
                for (var key in bezl.vars.main){
                    var obj = bezl.vars.main[key];

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
                
                parameters[parameterCount] = { "Key": "@DOC_TYPE", "Value": '850' };
                parameterCount = parameterCount + 1;

                parameters[parameterCount] = { "Key": "@SEARCHVALUE", "Value": bezl.vars.search };
                parameterCount = parameterCount + 1;

                parameters[parameterCount] = { "Key": "@SITE_ID", "Value": bezl.vars.config.siteId };
                parameterCount = parameterCount + 1;

                //Get User ID.
                for (var key in bezl.vars.user.USERS){
                    var obj = bezl.vars.user.USERS[key];

                    for (var prop in obj){
                        switch (prop.toString()){
                            case "EDI_SL_USER_ID":
                                parameters[parameterCount] = { "Key": "@USER_ID", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                            case "ENABLED":
                                parameters[parameterCount] = { "Key": "@USER_ENABLED", "Value": obj[prop] };
                                parameterCount = parameterCount + 1;
                                break;
                        }
                    }
                }

                // Pull in the header data for the logged in user
                bezl.dataService.add('main','brdb','EDI','Delete', { 
                    "QueryName": "Delete",
                    "Connection": bezl.vars.config.sqlConnection,
                    "Parameters": parameters },0);

                break;

            case "Approve":
                var parameters = [], parameterCount = 0, approve = false, approvalGUID = '';

                //Loop through header for header information.
                for (var key in bezl.vars.main){
                    var obj = bezl.vars.main[key];
                        
                    for (var prop in obj) {
                        if (prop.toString() == "APPROVE"){
                                approve = obj[prop];
                        } 
                    }
                    
                    if (approve == true){
                        parameters[parameterCount] = { "Key": "@DOC_TYPE", "Value": '850' };
                        parameterCount = parameterCount + 1;
        
                        parameters[parameterCount] = { "Key": "@EDI_DIRECTION", "Value": 'I' };
                        parameterCount = parameterCount + 1;

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
                                case "EDI_SL_FILE_ID":
                                    parameters[parameterCount] = { "Key": "@FILE_ID", "Value": obj[prop] };
                                    parameterCount = parameterCount + 1;
                                    break;
                                case "CUSTOMER_PO_REF":
                                    parameters[parameterCount] = { "Key": "@CUSTOMER_PO_REF", "Value": obj[prop] };
                                    parameterCount = parameterCount + 1;
                                    break;
                            }
                        }
                        
                        //Make unique GUID for dataservice to return to Bezlio.
                        approvalGUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                            return v.toString(16);
                        })

                        bezl.vars.approvalData.push({
                            id: approvalGUID
                        })

                        //Approve record with unique GUID for dataservice to return.
                        bezl.dataService.add(approvalGUID,'brdb','EDI','Approve', { 
                            "QueryName": "Approve",
                            "Connection": bezl.vars.config.sqlConnection,
                            "Parameters": parameters },0);                    
                        
                        //Reset variables.
                        parameterCount = 0;
                        parameters = [];
                        approve = false;
                    }
                }

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

        //Get bezl rows in mainTableMobile.
        tr = $(bezl.container.nativeElement).find("#mainTableMobile tr")
        
        // Loop through all rows
        for(var i = 0; i < tr.length; i++) {
            found = false;

            td = tr[i].getElementsByTagName("td");

            if(td.length > 0) {
                ediStatus = td[6].innerHTML;

                for(var k = 0; k < td.length; k++){
                    //If not the correct edi status, hide the row.
                    if(td[k].innerHTML.toUpperCase().indexOf(bezl.vars.filter.toUpperCase()) > -1 && ediStatus.toUpperCase().indexOf(bezl.vars.filterEdiStatus.toUpperCase()) > -1) {
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
                bezl.vars.main.sort(function (a, b) {
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
                bezl.vars.main.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.main.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    return B - A;
                });
            } 
        } else {
            if (bezl.vars.sort == "asc") { 
                bezl.vars.main.sort(function(a, b) {
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
                bezl.vars.main.sort(function(a, b) {
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
        selectAll: SelectAll,
        selectNone: SelectNone,
        runQuery: RunQuery,
        filterBy: FilterBy,
        sort: Sort
    }
});