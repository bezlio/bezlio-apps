define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "Invoices":
                bezl.vars.loading = true; 


                // Pull in the accounts list for the logged in user
                bezl.dataService.add('Invoices','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "InvoiceInquiry",
                    "Parameters": [
                        { "Key": "StartDate", "Value": bezl.vars.startDate || '01/01/1900'},
                        { "Key": "EndDate", "Value": bezl.vars.endDate || '01/01/2100'}
                    ] },0);
                break;
            default:
                break;
        }
    }

    function Select(bezl, Invoice) {
        // Mark the selected customer as selected
        for (var i = 0; i < bezl.vars.Invoices.length; i++) {
            if (bezl.vars.Invoices[i].InvoiceNum == Invoice.InvoiceNum) {
                bezl.vars.Invoices[i].Selected = !bezl.vars.Invoices[i].Selected;

                if (bezl.vars.Invoices[i].Selected) {
                    localStorage.setItem('selectedInvoice', JSON.stringify(bezl.vars.Invoices[i]));
                    $('.panel').trigger('selectedInvoice', [bezl.vars.Invoices[i]]);
                } else {
                    localStorage.setItem('selectedInvoice', '');
                    $('.panel').trigger('selectedInvoice', [{}]);
                }
                
            } else {
                bezl.vars.Invoices[i].Selected = false;
            }
        };
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
        if (sortColumn == "InvoiceNum" || sortColumn == "PoNum" || sortColumn == "InvoiceAmt" || sortColumn == "InvoiceBal") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.Invoices.sort(function (a, b) {
                    var A = a[sortColumn];
                    var B = b[sortColumn];
                    return A - B;
                });
            } else {
                bezl.vars.Invoices.sort(function (a, b) {
                    var A = a[sortColumn];
                    var B = b[sortColumn];
                    return B - A;
                });
            }
        } else if (sortColumn == "InvoiceDate" || sortColumn == "OrderDate") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.Invoices.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.Invoices.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    return B - A;
                });
            } 
        } else {
            if (bezl.vars.sort == "asc") { 
                bezl.vars.Invoices.sort(function(a, b) {
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
                bezl.vars.Invoices.sort(function(a, b) {
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
        if (sortColumn == "InvoiceLine" || sortColumn == "PartNum" || sortColumn == "UnitPrice" || sortColumn == "ExtPrice" || sortColumn == "Qty") {
            if (bezl.vars.sortInner == "asc") {
                bezl.vars.Invoices.sort(function (a, b) {
                    var A = a[sortColumn] || Number.MAX_SAFE_INTEGER;
                    var B = b[sortColumn] || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.Invoices.sort(function (a, b) {
                    var A = a[sortColumn] || Number.MAX_SAFE_INTEGER;
                    var B = b[sortColumn] || Number.MAX_SAFE_INTEGER;
                    return B - A;
                });
            }
        } else {
            if (bezl.vars.sortInner == "asc") { 
                bezl.vars.Invoices.sort(function(a, b) {
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
                bezl.vars.Invoices.sort(function(a, b) {
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
        runQuery: RunQuery,
        select: Select,
        sort: Sort,
        innerSort: InnerSort
    }
});