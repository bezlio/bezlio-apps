define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "PriceList":
                bezl.vars.loading = true; 

                // Pull in the accounts list for the logged in user
                bezl.dataService.add('PriceList','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "CustomerPriceList",
                    "Parameters": [
                        { "Key": "CustID", "Value": bezl.vars.selectedAccount.ID || ""}
                    ] },0);
                break;
            default:
                break;
        }
    }

    function Filter(bezl) {
        // Filter, will hide the table rows that do not match filter
        var tr, td;
        tr = document.getElementById("priceList").getElementsByTagName("tr");

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

    function Select(bezl, Part) {
        // Mark the selected customer as selected
        for (var i = 0; i < bezl.vars.PriceList.length; i++) {
            if (bezl.vars.PriceList[i].PartNum == Part.PartNum) {
                bezl.vars.PriceList[i].Selected = !bezl.vars.PriceList[i].Selected;

                if (bezl.vars.PriceList[i].Selected) {
                    localStorage.setItem('selectedPart', JSON.stringify(bezl.vars.PriceList[i]));
                    $('.panel').trigger('selectedPart', [bezl.vars.PriceList[i]]);
                } else {
                    localStorage.setItem('selectedPart', '');
                    $('.panel').trigger('selectedPart', [{}]);
                }
                
            } else {
                bezl.vars.PriceList[i].Selected = false;
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
        if (sortColumn == "PartNum" || sortColumn == "BasePrice" || sortColumn == "Quantity" || sortColumn == "PriceBreakUnitPrice") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.PriceList.sort(function (a, b) {
                    var A = a[sortColumn];
                    var B = b[sortColumn];
                    return A - B;
                });
            } else {
                bezl.vars.PriceList.sort(function (a, b) {
                    var A = a[sortColumn];
                    var B = b[sortColumn];
                    return B - A;
                });
            }
        } else if (sortColumn == "StartDate" || sortColumn == "EndDate") {
            if (bezl.vars.sort == "asc") {
                bezl.vars.PriceList.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.vars.PriceList.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    return B - A;
                });
            } 
        } else {
            if (bezl.vars.sort == "asc") { 
                bezl.vars.PriceList.sort(function(a, b) {
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
                bezl.vars.PriceList.sort(function(a, b) {
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
        if (sortColumn == "PartLine" || sortColumn == "UnitPrice" || sortColumn == "ExtPrice" || sortColumn == "Qty") {
            if (bezl.vars.sortInner == "asc") {
                bezl.vars.PriceList.sort(function (a, b) {
                     a = JSON.parse(localStorage.getItem("selectedPart"));
                   var A = new Array();
                   var B = new Array();

                    for( var i = 0; i < a.PartLines.length; i++){
                        A.push(a.PartLines[i][sortColumn]);
                        B.push(a.PartLines[i][sortColumn]);
                    }
                    B.reverse();
                    console.log(parseFloat(A) - parseFloat(B));
                    return parseFloat(A) - parseFloat(B);
                });
            } else {
                bezl.vars.PriceList.sort(function (a, b) {
                    a = JSON.parse(localStorage.getItem("selectedPart"));
                   var A = new Array();
                   var B = new Array();

                    for( var i = 0; i < a.PartLines.length; i++){
                        A.push(a.PartLines[i][sortColumn]);
                        B.push(a.PartLines[i][sortColumn]);
                    }
                    B.reverse();
                    return parseFloat(B) - parseFloat(A);
                });
            }
        } else {
            if (bezl.vars.sortInner == "asc") { 
                bezl.vars.PriceList.sort(function(a, b) {
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
                bezl.vars.PriceList.sort(function(a, b) {
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
        filter: Filter,
        select: Select,
        sort: Sort,
        innerSort: InnerSort
    }
});