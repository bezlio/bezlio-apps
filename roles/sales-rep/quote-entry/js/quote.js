define(function () {

    function RunQuery(bezl, queryName) {
        switch (queryName) {
            case "Quotes":
                bezl.vars.loading = true;

                bezl.dataService.add('Quotes', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuotesByRep"
                }, 0);
                break;
            case "SalesReps":
                bezl.dataService.add('SalesReps', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetSalesReps"
                }, 0);
                break;
            case "QuoteDtls":
                bezl.dataService.add('QuoteDtls', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuoteDetails",
                    "Parameters": [
                        { Key: "QuoteNum", Value: bezl.vars.quoteData.quoteNum }
                    ]
                }, 0)
                break;
            case "Parts":
                bezl.dataService.add('Parts', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetParts"
                }, 0);
                break;
        }
    }

    function ReturnToSummary(bezl) {
        bezl.vars.editingQuote = false;

        bezl.vars.quoteData = {
            quoteDate: new Date(),
            salespersonId: bezl.env.currentUser,
            customerId: '',
            comments: '',
            status: 'Open',
            result: '',
            quoteLines: []
        };
    }

    function AddLine(bezl) {
        var lineNum = Math.max.apply(Math, bezl.vars.quoteData.quoteLines.map(function (dtl) { return dtl.QuoteLine; }));

        bezl.data.QuoteDtls.push({ QuoteLine: lineNum + 1, PartNum: '', OrderQty: 1, SellingExpectedUM: 'EA' });

        var partList = [{ "PartNum": "Server1" }, { "PartNum": "Server2" }, { "PartNum": "Server3" }]

        var typeAhead = function (lineNum) {
            $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead('destroy');
            $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead({
                order: "asc",
                maxItem: 8,
                display: ['PartNum'],
                source: {
                    data: function () { return partList; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        console.log("test");
                    }
                }
            });
        }

        setTimeout(typeAhead, 2, lineNum + 1);
    }

    function DeleteLine(bezl, lineNum) {
        console.log("Line: " + lineNum);

        // bezl.vars.quoteData.quoteLines = bezl.vars.quoteData.quoteLines.filter(dtl =>
        //     dtl.QuoteLine !== lineNum
        // );

        bezl.data.QuoteDtls = bezl.data.QuoteDtls.filter(dtl =>
            dtl.QuoteLine !== lineNum
        );
    }

    function SaveQuote(bezl, quoteNum) {

    }


    // // Write the header and the lines.  Saving will flip back to false in onDataChange
    // bezl.dataService.add('SaveQuoteHeader'
    //     , 'brdb'
    //     , 'SQLServer'
    //     , 'ExecuteNonQuery'
    //     ,
    //     {
    //         "Context": "QuoteEntry"
    //         , "Connection": "VMFG"
    //         , "QueryName": ((bezl.vars['quoteData'].newQuote) ? "AddQuoteHeader" : "UpdateQuoteHeader")
    //         , "Parameters": [
    //             { Key: "QuoteNum", Value: bezl.vars['quoteData'].quoteNum },
    //             { Key: "Date", Value: bezl.vars['quoteData'].quoteDate },
    //             { Key: "CustomerID", Value: bezl.vars['quoteData'].customerId || 0 },
    //             { Key: "CustomerName", Value: bezl.vars['quoteData'].customerName || 0 },
    //             { Key: "Comments", Value: bezl.vars['quoteData'].comments || "" },
    //             { Key: "Status", Value: bezl.vars['quoteData'].status || "" },
    //             { Key: "Result", Value: bezl.vars['quoteData'].result || "" },
    //             { Key: "SalespersonID", Value: bezl.vars['quoteData'].salespersonId || "" }
    //         ]
    //     }
    //     , 0);

    // // Now add / update the rows according to whether they are listed in the addedLines
    // for (var i = 0; i < bezl.vars['quoteData'].quoteLines.length; i++) {
    //     if (bezl.vars['quoteData'].quoteLines[i].deleted == 0) {
    //         bezl.dataService.add('SaveQuoteLine_' + i
    //             , 'brdb'
    //             , 'SQLServer'
    //             , 'ExecuteNonQuery'
    //             ,
    //             {
    //                 "Context": "QuoteEntry"
    //                 , "Connection": "VMFG"
    //                 , "QueryName": ((bezl.vars['addedLines'].indexOf(bezl.vars['quoteData'].quoteLines[i].lineNum) != -1) ? "AddQuoteLine" : "UpdateQuoteLine")
    //                 , "Parameters": [
    //                     { Key: "QuoteNum", Value: bezl.vars['quoteData'].quoteNum },
    //                     { Key: "LineNum", Value: bezl.vars['quoteData'].quoteLines[i].lineNum },
    //                     { Key: "PartNum", Value: bezl.vars['quoteData'].quoteLines[i].partNum || bezl.vars['quoteData'].quoteLines[i].partDesc || '' },
    //                     { Key: "PartDesc", Value: bezl.vars['quoteData'].quoteLines[i].partDesc || '' },
    //                     { Key: "QuoteQty", Value: bezl.vars['quoteData'].quoteLines[i].quoteQty || 0 },
    //                     { Key: "UOM", Value: bezl.vars['quoteData'].quoteLines[i].quoteUom || '' },
    //                     { Key: "Deleted", Value: bezl.vars['quoteData'].quoteLines[i].deleted }
    //                 ]
    //             }
    //             , 0);
    //     }
    // };


    return {
        runQuery: RunQuery,
        returnToSummary: ReturnToSummary,
        addLine: AddLine,
        deleteLine: DeleteLine
    }
});

// require(['https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/js/quote.js'], function(functions) {
// 	functions.runQuery(bezl, "Quotes");
// });